import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, CircleDot, ScanSearch, Users, Activity, ShieldCheck, Loader2, RefreshCw } from 'lucide-react';

interface Detection { class: string; score: number; bbox: [number, number, number, number]; }
interface TrackedDetection extends Detection { trackId: number; }

const TF_URL = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0/dist/tf.min.js';
const COCO_URL = 'https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd@2.2.3/dist/coco-ssd.min.js';

function loadScript(src: string, id: string) {
  return new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(id) as HTMLScriptElement | null;
    if (existing) {
      if ((existing as any).dataset.loaded === 'true') return resolve();
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error(`Gagal memuat ${src}`)), { once: true });
      return;
    }
    const script = document.createElement('script');
    script.id = id;
    script.src = src;
    script.async = true;
    script.onload = () => { script.dataset.loaded = 'true'; resolve(); };
    script.onerror = () => reject(new Error(`Gagal memuat ${src}`));
    document.head.appendChild(script);
  });
}

const center = (d: Detection) => [d.bbox[0] + d.bbox[2] / 2, d.bbox[1] + d.bbox[3] / 2];

export const AIObservationEngine: React.FC<{ onObservationUpdate?: (text: string) => void }> = ({ onObservationUpdate }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const modelRef = useRef<any>(null);
  const previousFrameRef = useRef<ImageData | null>(null);
  const previousTracksRef = useRef<TrackedDetection[]>([]);
  const detectionsRef = useRef<TrackedDetection[]>([]);
  const movementRef = useRef(0);
  const nextTrackIdRef = useRef(1);
  const rafRef = useRef<number | null>(null);
  const lastInferenceRef = useRef(0);
  const [running, setRunning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detections, setDetections] = useState<TrackedDetection[]>([]);
  const [movement, setMovement] = useState(0);
  const [status, setStatus] = useState('Siap');
  const [fps, setFps] = useState(0);

  const stopCamera = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setRunning(false);
    setStatus('Kamera berhenti');
    setDetections([]);
    detectionsRef.current = [];
    previousFrameRef.current = null;
  };

  const trackObjects = (next: Detection[]): TrackedDetection[] => {
    const old = previousTracksRef.current;
    const used = new Set<number>();
    const result: TrackedDetection[] = next.map(d => {
      const c = center(d);
      let best: TrackedDetection | undefined;
      let bestDist = Infinity;
      for (const candidate of old) {
        if (used.has(candidate.trackId) || candidate.class !== d.class) continue;
        const cc = center(candidate);
        const dist = Math.hypot(c[0] - cc[0], c[1] - cc[1]);
        if (dist < bestDist && dist < 120) { best = candidate; bestDist = dist; }
      }
      const trackId = best ? best.trackId : nextTrackIdRef.current++;
      if (best) used.add(best.trackId);
      return { ...d, trackId };
    });
    previousTracksRef.current = result;
    return result;
  };

  const analyzeFrame = async (now: number) => {
    if (!videoRef.current || !canvasRef.current || !running) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video.readyState < 2) { rafRef.current = requestAnimationFrame(analyzeFrame); return; }

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    const w = 640;
    const h = Math.max(360, Math.round((video.videoHeight / Math.max(video.videoWidth, 1)) * w));
    canvas.width = w; canvas.height = h;
    ctx.drawImage(video, 0, 0, w, h);

    const frame = ctx.getImageData(0, 0, w, h);
    const prev = previousFrameRef.current;
    if (prev) {
      let changed = 0;
      const step = 16;
      for (let i = 0; i < frame.data.length; i += 4 * step) {
        const diff = Math.abs(frame.data[i] - prev.data[i]) + Math.abs(frame.data[i + 1] - prev.data[i + 1]) + Math.abs(frame.data[i + 2] - prev.data[i + 2]);
        if (diff > 55) changed++;
      }
      const ratio = Math.min(100, (changed / (frame.data.length / (4 * step))) * 100);
      const movementValue = Math.round(ratio);
      movementRef.current = movementValue;
      setMovement(movementValue);
    }
    previousFrameRef.current = frame;

    if (modelRef.current && now - lastInferenceRef.current > 700) {
      lastInferenceRef.current = now;
      try {
        const preds = await modelRef.current.detect(video);
        const filtered: Detection[] = preds.filter((p: any) => p.score >= 0.55).map((p: any) => ({ class: p.class, score: p.score, bbox: p.bbox }));
        const tracked = trackObjects(filtered);
        detectionsRef.current = tracked;
        setDetections(tracked);
        setFps(Math.round(1000 / Math.max(now - lastInferenceRef.current + 1, 1)));
        const people = tracked.filter(d => d.class === 'person').length;
        const objects = tracked.length;
        onObservationUpdate?.(`Computer Vision realtime: ${people} orang terdeteksi, ${objects} objek terdeteksi, tingkat pergerakan frame ${Math.round(movementRef.current)}%. Engine: COCO-SSD Object Detection + centroid tracking + frame-difference movement detection.`);
      } catch (e) {
        console.warn('Inference error', e);
      }
    }

    const displayCtx = canvas.getContext('2d');
    if (displayCtx) {
      displayCtx.clearRect(0, 0, w, h);
      displayCtx.drawImage(video, 0, 0, w, h);
      displayCtx.lineWidth = 3;
      trackedOverlay(displayCtx, detectionsRef.current);
    }
    rafRef.current = requestAnimationFrame(analyzeFrame);
  };

  const trackedOverlay = (ctx: CanvasRenderingContext2D, items: TrackedDetection[]) => {
    items.forEach(d => {
      const [x, y, bw, bh] = d.bbox;
      ctx.strokeStyle = '#8B9A82';
      ctx.strokeRect(x, y, bw, bh);
      ctx.fillStyle = '#8B9A82';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText(`${d.class} #${d.trackId} ${(d.score * 100).toFixed(0)}%`, x + 4, Math.max(16, y + 16));
    });
  };

  const startCamera = async () => {
    setError(null); setLoading(true); setStatus('Memuat AI Computer Vision...');
    try {
      await loadScript(TF_URL, 'tfjs-cv-engine');
      await loadScript(COCO_URL, 'coco-ssd-cv-engine');
      if (!modelRef.current) {
        setStatus('Memuat model Object Detection...');
        modelRef.current = await (window as any).cocoSsd.load({ base: 'lite_mobilenet_v2' });
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false });
      streamRef.current = stream;
      if (!videoRef.current) throw new Error('Elemen video tidak tersedia.');
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      previousFrameRef.current = null;
      previousTracksRef.current = [];
      nextTrackIdRef.current = 1;
      setRunning(true);
      setStatus('LIVE — Computer Vision aktif');
    } catch (e: any) {
      setError(e?.message || 'Kamera/AI tidak dapat dijalankan. Pastikan HTTPS dan izin kamera aktif.');
      setStatus('Gagal menjalankan engine');
      stopCamera();
    } finally { setLoading(false); }
  };

  useEffect(() => {
    if (running) rafRef.current = requestAnimationFrame(analyzeFrame);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [running]);

  useEffect(() => () => { streamRef.current?.getTracks().forEach(t => t.stop()); }, []);

  const people = detections.filter(d => d.class === 'person').length;
  return <div className="mt-5 rounded-3xl border border-[#D3D8C8] bg-[#F4F6F2] overflow-hidden">
    <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#D3D8C8]">
      <div>
        <div className="flex items-center gap-2 text-[#4A4E3D] font-bold"><ScanSearch className="w-5 h-5"/> AI Observation Engine — Computer Vision</div>
        <p className="text-[11px] text-[#6E6A60] mt-1">Deteksi objek, tracking sederhana, people counting, dan movement detection langsung di browser.</p>
      </div>
      <div className="flex gap-2">
        {!running ? <button onClick={startCamera} disabled={loading} className="px-4 py-2 rounded-xl bg-[#5A5E4B] text-white text-xs font-bold flex items-center gap-2 disabled:opacity-60">{loading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Camera className="w-4 h-4"/>}{loading ? 'Memuat AI...' : 'Mulai Kamera AI'}</button> : <button onClick={stopCamera} className="px-4 py-2 rounded-xl bg-[#C88E75] text-white text-xs font-bold flex items-center gap-2"><CameraOff className="w-4 h-4"/> Hentikan</button>}
      </div>
    </div>
    <div className="grid lg:grid-cols-3 gap-4 p-4">
      <div className="lg:col-span-2 relative rounded-2xl overflow-hidden bg-[#20221C] min-h-[260px] flex items-center justify-center">
        <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover opacity-0 pointer-events-none" playsInline muted />
        <canvas ref={canvasRef} className="w-full h-auto max-h-[480px] object-contain" />
        {!running && <div className="absolute inset-0 flex flex-col items-center justify-center text-white/70 text-center gap-2"><Camera className="w-10 h-10"/><span className="text-sm font-semibold">Kamera belum aktif</span><span className="text-[11px]">Gunakan HTTPS/localhost dan izinkan akses kamera.</span></div>}
        {running && <div className="absolute left-3 top-3 px-2.5 py-1 rounded-full bg-black/60 text-white text-[10px] font-bold flex items-center gap-1.5"><CircleDot className="w-3 h-3 text-red-400 animate-pulse"/> LIVE</div>}
      </div>
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <Metric icon={<Users/>} label="People" value={people}/>
          <Metric icon={<Activity/>} label="Gerakan" value={`${movement}%`}/>
          <Metric icon={<ScanSearch/>} label="Objek" value={detections.length}/>
          <Metric icon={<RefreshCw/>} label="Status" value={running ? 'LIVE' : 'OFF'}/>
        </div>
        <div className="rounded-2xl bg-white border border-[#E5DFD1] p-3 text-[11px] text-[#5A5E4B]">
          <div className="font-bold mb-2">Objek terdeteksi</div>
          {detections.length === 0 ? <div className="text-[#8D887B]">Belum ada objek dengan confidence ≥55%.</div> : detections.map(d => <div key={d.trackId} className="flex justify-between py-1 border-b border-[#F2EDE4] last:border-0"><span>{d.class} #{d.trackId}</span><b>{Math.round(d.score * 100)}%</b></div>)}
        </div>
        <div className="rounded-2xl bg-[#E8EADF] border border-[#D3D8C8] p-3 text-[10px] text-[#4A4E3D] flex gap-2"><ShieldCheck className="w-4 h-4 shrink-0"/><span>Non-diagnostik: Computer Vision hanya membaca pola visual/gerakan. Interpretasi pedagogis tetap memerlukan konteks guru dan verifikasi manusia.</span></div>
        {error && <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-[11px] text-red-700">{error}</div>}
      </div>
    </div>
    <div className="px-4 pb-4 text-[10px] text-[#777267]">{status}{fps ? ` • inference ~${fps} FPS` : ''} • Model: COCO-SSD Lite MobileNet v2 • Pemrosesan video dilakukan lokal di browser setelah model dimuat dari CDN.</div>
  </div>;
};

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return <div className="rounded-2xl bg-white border border-[#E5DFD1] p-3"><div className="flex items-center gap-1.5 text-[#8B9A82]">{React.cloneElement(icon as React.ReactElement, { className: 'w-4 h-4' })}<span className="text-[10px] text-[#777267]">{label}</span></div><div className="text-xl font-bold text-[#4A4E3D] mt-1">{value}</div></div>;
}
