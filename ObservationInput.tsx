import React, { useState, useRef, useEffect } from 'react';
import {
  Brain,
  Video,
  Mic,
  Image as ImageIcon,
  Upload,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Info,
  Clock,
  User,
  School,
  FileSpreadsheet,
  X,
  Play,
  Square,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import {
  ChildProfileMeta,
  MediaAttachment,
  ObservationData,
  ObservationDomainKey,
} from '../types';
import {
  DOMAIN_METADATA_LIST,
  MASTER_OBSERVATION_INDICATORS,
} from '../data/observationIndicators';
import { AIObservationEngine } from './AIObservationEngine';

interface ObservationInputProps {
  observationData: ObservationData;
  onChangeData: (data: ObservationData) => void;
  onAnalyze: (customPrompt?: string) => void;
  isLoading: boolean;
  onSelectSampleCase: (caseId: string) => void;
}

export const ObservationInput: React.FC<ObservationInputProps> = ({
  observationData,
  onChangeData,
  onAnalyze,
  isLoading,
  onSelectSampleCase,
}) => {
  const [activeCategory, setActiveCategory] = useState<ObservationDomainKey>('attention_executive');
  const [isRecordingAudio, setIsRecordingAudio] = useState<boolean>(false);
  const [audioRecordDuration, setAudioRecordDuration] = useState<number>(0);
  const [customFocusPrompt, setCustomFocusPrompt] = useState<string>('');
  const [mediaUploadError, setMediaUploadError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioIntervalRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { childMeta, selectedIndicators, anecdotalNotes, mediaAttachments } = observationData;

  // Update Child Meta
  const updateChildMeta = (field: keyof ChildProfileMeta, value: any) => {
    onChangeData({
      ...observationData,
      childMeta: {
        ...childMeta,
        [field]: value,
      },
    });
  };

  // Toggle Indicator
  const toggleIndicator = (id: string) => {
    const exists = selectedIndicators.includes(id);
    const newSelected = exists
      ? selectedIndicators.filter((item) => item !== id)
      : [...selectedIndicators, id];

    onChangeData({
      ...observationData,
      selectedIndicators: newSelected,
    });
  };

  // Handle File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAttachments: MediaAttachment[] = [...mediaAttachments];

    Array.from(files).forEach((file: File) => {
      let type: 'video' | 'audio' | 'image' = 'image';
      if (file.type.startsWith('video/')) type = 'video';
      else if (file.type.startsWith('audio/')) type = 'audio';

      const sizeStr = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
      newAttachments.push({
        type,
        name: file.name,
        size: sizeStr,
        description: `Berkas ${type} observasi diunggah oleh ${childMeta.observerName || 'Pengamat'}`,
      });
    });

    onChangeData({
      ...observationData,
      mediaAttachments: newAttachments,
    });

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Remove Media
  const removeMedia = (index: number) => {
    const updated = [...mediaAttachments];
    updated.splice(index, 1);
    onChangeData({
      ...observationData,
      mediaAttachments: updated,
    });
  };

  // Audio Recording Mock/Browser Real Recorder
  const startAudioRecording = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.start();

        setIsRecordingAudio(true);
        setAudioRecordDuration(0);
        audioIntervalRef.current = setInterval(() => {
          setAudioRecordDuration((prev) => prev + 1);
        }, 1000);
      } else {
        // Fallback simulation
        setIsRecordingAudio(true);
        setAudioRecordDuration(0);
        audioIntervalRef.current = setInterval(() => {
          setAudioRecordDuration((prev) => prev + 1);
        }, 1000);
      }
    } catch (err) {
      console.warn('Microphone access not available, simulating recording.', err);
      setIsRecordingAudio(true);
      setAudioRecordDuration(0);
      audioIntervalRef.current = setInterval(() => {
        setAudioRecordDuration((prev) => prev + 1);
      }, 1000);
    }
  };

  const stopAudioRecording = () => {
    if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    setIsRecordingAudio(false);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }

    const durationMin = Math.floor(audioRecordDuration / 60);
    const durationSec = audioRecordDuration % 60;
    const formattedDuration = `${durationMin}:${durationSec < 10 ? '0' : ''}${durationSec}`;

    const newAttachment: MediaAttachment = {
      type: 'audio',
      name: `Catatan_Suara_Observasi_${new Date().toLocaleTimeString('id-ID')}.wav`,
      size: `${(audioRecordDuration * 0.05).toFixed(1)} MB`,
      duration: formattedDuration,
      description: `Rekaman catatan verbal & analisis prosodi suara anak (${formattedDuration})`,
    };

    onChangeData({
      ...observationData,
      mediaAttachments: [...mediaAttachments, newAttachment],
    });
    setAudioRecordDuration(0);
  };

  const indicatorsInActiveCategory = MASTER_OBSERVATION_INDICATORS.filter(
    (i) => i.category === activeCategory
  );

  return (
    <div className="space-y-6">
      {/* Introduction & Non-Diagnostic Ethical Banner */}
      <div className="bg-[#4A4E3D] rounded-3xl p-6 sm:p-8 text-[#FDFCF7] shadow-sm relative overflow-hidden border border-[#5A5E4B]">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#8B9A82]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5A5E4B] border border-[#8B9A82]/40 text-[#E8EADF] text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#8B9A82]" />
              Protokol Observasi Neuropsikologi Perkembangan (Non-Diagnostik)
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#FDFCF7] tracking-tight">
              Instrumen Observasi Multimodal & Pemetaan Karakteristik Belajar
            </h2>
            <p className="text-[#D9D4C7] text-sm leading-relaxed">
              Menganalisis atensi, fungsi eksekutif, koordinasi motorik, komunikasi, regulasi sensori, dan pola interaksi anak secara holistik untuk merumuskan intervensi pedagogis personal yang memuliakan martabat anak.
            </p>
          </div>

          {/* Quick Case buttons */}
          <div className="flex flex-wrap md:flex-col gap-2 shrink-0">
            <span className="text-xs font-semibold text-[#D9D4C7] uppercase tracking-wider block">
              Contoh Kasus Cepat:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onSelectSampleCase('case-bima')}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs text-[#FDFCF7] font-medium transition-colors"
              >
                👦 Bima (Kinestetik)
              </button>
              <button
                type="button"
                onClick={() => onSelectSampleCase('case-alya')}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs text-[#FDFCF7] font-medium transition-colors"
              >
                👧 Alya (Visual-Sensitif)
              </button>
              <button
                type="button"
                onClick={() => onSelectSampleCase('case-dafi')}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs text-[#FDFCF7] font-medium transition-colors"
              >
                🧒 Dafi (Imajinatif)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Child Meta & Multimodal Station */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Section 1: Child Context & Meta (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-[#E5DFD1] shadow-2xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-[#F2EDE4]">
            <User className="w-5 h-5 text-[#8B9A82]" />
            <h3 className="font-serif font-bold text-[#4A4E3D] text-base">
              Identitas Anak & Konteks Observasi
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#5A5E4B] mb-1">
                Nama Lengkap / Inisial Anak <span className="text-[#C88E75]">*</span>
              </label>
              <input
                type="text"
                value={childMeta.childName}
                onChange={(e) => updateChildMeta('childName', e.target.value)}
                placeholder="Contoh: Bima Satria"
                className="w-full px-3.5 py-2.5 text-sm bg-[#FDFCF7] border border-[#D9D4C7] rounded-xl focus:ring-2 focus:ring-[#8B9A82] focus:bg-white focus:outline-hidden transition-all text-[#3D3B36]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#5A5E4B] mb-1">
                  Usia (Tahun & Bulan) <span className="text-[#C88E75]">*</span>
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      min="2"
                      max="14"
                      value={childMeta.ageYears}
                      onChange={(e) => updateChildMeta('ageYears', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 text-sm bg-[#FDFCF7] border border-[#D9D4C7] rounded-xl focus:ring-2 focus:ring-[#8B9A82] text-[#3D3B36]"
                    />
                    <span className="absolute right-2.5 top-2 text-xs text-[#8D887B]">th</span>
                  </div>
                  <div className="relative flex-1">
                    <input
                      type="number"
                      min="0"
                      max="11"
                      value={childMeta.ageMonths}
                      onChange={(e) => updateChildMeta('ageMonths', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 text-sm bg-[#FDFCF7] border border-[#D9D4C7] rounded-xl focus:ring-2 focus:ring-[#8B9A82] text-[#3D3B36]"
                    />
                    <span className="absolute right-2.5 top-2 text-xs text-[#8D887B]">bln</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5A5E4B] mb-1">
                  Jenis Kelamin
                </label>
                <select
                  value={childMeta.gender}
                  onChange={(e) => updateChildMeta('gender', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-[#FDFCF7] border border-[#D9D4C7] rounded-xl focus:ring-2 focus:ring-[#8B9A82] text-[#3D3B36]"
                >
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#5A5E4B] mb-1">
                  Nama Pengamat
                </label>
                <input
                  type="text"
                  value={childMeta.observerName}
                  onChange={(e) => updateChildMeta('observerName', e.target.value)}
                  placeholder="Nama Pendidik"
                  className="w-full px-3 py-2 text-sm bg-[#FDFCF7] border border-[#D9D4C7] rounded-xl focus:ring-2 focus:ring-[#8B9A82] text-[#3D3B36]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5A5E4B] mb-1">
                  Peran Pengamat
                </label>
                <select
                  value={childMeta.observerRole}
                  onChange={(e) => updateChildMeta('observerRole', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-[#FDFCF7] border border-[#D9D4C7] rounded-xl focus:ring-2 focus:ring-[#8B9A82] text-[#3D3B36]"
                >
                  <option value="Guru Kelas">Guru Kelas</option>
                  <option value="Guru Pendamping Khusus (GPK)">Guru Pendamping (GPK)</option>
                  <option value="Psikolog Pendidikan">Psikolog Pendidikan</option>
                  <option value="Orang Tua">Orang Tua</option>
                  <option value="Terapis Perkembangan">Terapis Perkembangan</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#5A5E4B] mb-1">
                  Setting / Lokasi Observasi
                </label>
                <select
                  value={childMeta.observationSetting}
                  onChange={(e) => updateChildMeta('observationSetting', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-[#FDFCF7] border border-[#D9D4C7] rounded-xl focus:ring-2 focus:ring-[#8B9A82] text-[#3D3B36]"
                >
                  <option value="Ruang Kelas PAUD/TK">Ruang Kelas PAUD/TK</option>
                  <option value="Ruang Kelas SD Awal">Ruang Kelas SD Awal</option>
                  <option value="Area Bermain / Outdoor">Area Bermain / Outdoor</option>
                  <option value="Rumah / Lingkungan Alami">Rumah / Alami</option>
                  <option value="Sesi Observasi Terstruktur">Sesi Terstruktur</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5A5E4B] mb-1">
                  Durasi Observasi
                </label>
                <input
                  type="text"
                  value={childMeta.observationDuration}
                  onChange={(e) => updateChildMeta('observationDuration', e.target.value)}
                  placeholder="Contoh: 45 Menit"
                  className="w-full px-3 py-2 text-sm bg-[#FDFCF7] border border-[#D9D4C7] rounded-xl focus:ring-2 focus:ring-[#8B9A82] text-[#3D3B36]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5A5E4B] mb-1">
                Target Kerangka Kurikulum
              </label>
              <select
                value={childMeta.curriculumTarget}
                onChange={(e) => updateChildMeta('curriculumTarget', e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-[#FDFCF7] border border-[#D3D8C8] rounded-xl focus:ring-2 focus:ring-[#8B9A82] text-[#3D3B36] font-medium"
              >
                <option value="Kurikulum Merdeka (PAUD/Fase Fondasi)">
                  Kurikulum Merdeka (PAUD/Fase Fondasi)
                </option>
                <option value="Kurikulum Merdeka (Fase A/Kelas 1-2 SD)">
                  Kurikulum Merdeka (Fase A/Kelas 1-2 SD)
                </option>
                <option value="Pendekatan Montessori">Pendekatan Montessori</option>
                <option value="Reggio Emilia">Pendekatan Reggio Emilia</option>
                <option value="Kurikulum Inklusif / Adaptif">Kurikulum Inklusif / Adaptif</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5A5E4B] mb-1">
                Fokus Observasi Khusus / Pertanyaan Guru
              </label>
              <textarea
                rows={2}
                value={childMeta.focusNotes || ''}
                onChange={(e) => updateChildMeta('focusNotes', e.target.value)}
                placeholder="Contoh: Mengamati respon anak saat transisi lingkaran pagi dan kemampuan mempertahankan fokus di sentra balok."
                className="w-full px-3 py-2 text-xs bg-[#FDFCF7] border border-[#D9D4C7] rounded-xl focus:ring-2 focus:ring-[#8B9A82] text-[#3D3B36]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Multimodal Media & Voice Station (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-[#E5DFD1] shadow-2xs space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F2EDE4]">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-[#8B9A82]" />
                <h3 className="font-serif font-bold text-[#4A4E3D] text-base">
                  Stasiun Observasi Multimodal (Video, Audio, Foto)
                </h3>
              </div>
              <span className="text-xs bg-[#E8EADF] text-[#5A5E4B] px-2.5 py-0.5 rounded-full font-medium border border-[#D3D8C8]">
                {mediaAttachments.length} Berkas Terlampir
              </span>
            </div>

            {/* Media Upload and Voice Recording Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Voice Recorder Button */}
              <div className="p-4 rounded-2xl border-2 border-dashed border-[#D3D8C8] bg-[#F4F6F2] flex flex-col items-center justify-center text-center gap-2">
                <div className="w-10 h-10 rounded-full bg-[#8B9A82] text-white flex items-center justify-center shadow-xs">
                  <Mic className={`w-5 h-5 ${isRecordingAudio ? 'animate-pulse text-[#C88E75]' : ''}`} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#3D3B36]">
                    {isRecordingAudio ? `Merekam Catatan Suara (${audioRecordDuration}s)` : 'Catatan Audio / Analisis Suara'}
                  </h4>
                  <p className="text-[11px] text-[#8D887B] mt-0.5">
                    Merekam intonasi suara, prosodi, atau narasi verbal guru
                  </p>
                </div>
                {isRecordingAudio ? (
                  <button
                    type="button"
                    onClick={stopAudioRecording}
                    className="mt-1 px-3 py-1.5 bg-[#C88E75] hover:bg-[#B87B62] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Square className="w-3.5 h-3.5" /> Berhenti & Simpan
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={startAudioRecording}
                    className="mt-1 px-3 py-1.5 bg-[#5A5E4B] hover:bg-[#4A4E3D] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Mic className="w-3.5 h-3.5" /> Mulai Rekam Audio
                  </button>
                )}
              </div>

              {/* Upload Media Card */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-4 rounded-2xl border-2 border-dashed border-[#D9D4C7] hover:border-[#8B9A82] bg-[#F8F7F2] hover:bg-[#F2EDE4] cursor-pointer flex flex-col items-center justify-center text-center gap-2 transition-all group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="video/*,audio/*,image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="w-10 h-10 rounded-full bg-[#E9E4D8] group-hover:bg-[#E8EADF] text-[#5A5E4B] group-hover:text-[#4A4E3D] flex items-center justify-center transition-colors">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#3D3B36]">
                    Unggah Video / Foto Interaksi
                  </h4>
                  <p className="text-[11px] text-[#8D887B] mt-0.5">
                    Format MP4, MOV, WAV, MP3, PNG, JPG (Maks 50MB)
                  </p>
                </div>
                <span className="text-xs text-[#5A5E4B] font-semibold group-hover:underline">
                  Pilih Berkas dari Komputer
                </span>
              </div>
            </div>

            <AIObservationEngine onObservationUpdate={(text) => {
              if (!observationData.anecdotalNotes.includes('Computer Vision realtime:')) {
                onChangeData({ ...observationData, anecdotalNotes: `${observationData.anecdotalNotes ? observationData.anecdotalNotes + '\n' : ''}${text}` });
              }
            }} />

            {/* Attached Media List */}
            {mediaAttachments.length > 0 && (
              <div className="space-y-2 mt-2">
                <h4 className="text-xs font-bold text-[#5A5E4B]">Lampiran Observasi Aktif:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {mediaAttachments.map((media, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 bg-[#F8F7F2] border border-[#E5DFD1] rounded-xl text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {media.type === 'video' ? (
                          <Video className="w-4 h-4 text-[#8B9A82] shrink-0" />
                        ) : media.type === 'audio' ? (
                          <Mic className="w-4 h-4 text-[#C88E75] shrink-0" />
                        ) : (
                          <ImageIcon className="w-4 h-4 text-[#5A5E4B] shrink-0" />
                        )}
                        <div className="truncate">
                          <p className="font-semibold text-[#3D3B36] truncate">{media.name}</p>
                          <p className="text-[10px] text-[#8D887B]">
                            {media.size} {media.duration ? `• ${media.duration}` : ''}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMedia(idx)}
                        className="text-[#8D887B] hover:text-[#C88E75] p-1 transition-colors"
                        title="Hapus berkas"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-3.5 bg-[#F2EDE4] rounded-2xl border border-[#D9D4C7] flex items-start gap-2.5 text-xs text-[#5A5E4B]">
            <Info className="w-4 h-4 text-[#8B9A82] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Privasi & Etika Observasi Anak:</span> Seluruh rekaman media dianalisis secara aman untuk memetakan kebutuhan pedagogis. Berkas tidak disebarluaskan untuk tujuan komersial.
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Multi-Domain Behavioral Checklist & Qualitative Anecdotal Notes */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E5DFD1] shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F2EDE4]">
          <div>
            <h3 className="font-serif font-bold text-[#4A4E3D] text-lg flex items-center gap-2">
              <Brain className="w-5 h-5 text-[#8B9A82]" />
              Indikator Observasi Neuropsikologi 6 Domain
            </h3>
            <p className="text-xs text-[#8D887B] mt-0.5">
              Pilih perilaku dan karakteristik yang teramati selama sesi observasi anak.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#E8EADF] text-[#5A5E4B] border border-[#D3D8C8]">
              {selectedIndicators.length} Indikator Terpilih
            </span>
          </div>
        </div>

        {/* Category Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-[#F2EDE4]">
          {DOMAIN_METADATA_LIST.map((domain) => {
            const isSelected = activeCategory === domain.key;
            const count = MASTER_OBSERVATION_INDICATORS.filter(
              (i) => i.category === domain.key && selectedIndicators.includes(i.id)
            ).length;

            return (
              <button
                key={domain.key}
                type="button"
                onClick={() => setActiveCategory(domain.key)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-[#8B9A82] text-white shadow-2xs'
                    : 'bg-[#F2EDE4] text-[#6B685F] hover:bg-[#E9E4D8]'
                }`}
              >
                <span>{domain.title}</span>
                {count > 0 && (
                  <span
                    className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center ${
                      isSelected ? 'bg-white text-[#5A5E4B] font-bold' : 'bg-[#5A5E4B] text-white'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Indicators List for Active Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {indicatorsInActiveCategory.map((indicator) => {
            const checked = selectedIndicators.includes(indicator.id);
            return (
              <div
                key={indicator.id}
                onClick={() => toggleIndicator(indicator.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 select-none ${
                  checked
                    ? 'bg-[#F4F6F2] border-[#8B9A82] ring-1 ring-[#8B9A82]/30 shadow-2xs'
                    : 'bg-[#FDFCF7] hover:bg-[#F8F7F2] border-[#E5DFD1]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-lg flex items-center justify-center mt-0.5 shrink-0 transition-colors ${
                    checked ? 'bg-[#8B9A82] text-white' : 'border border-[#D9D4C7] bg-white'
                  }`}
                >
                  {checked && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
                <div className="space-y-1">
                  <h4 className={`text-xs font-bold leading-snug ${checked ? 'text-[#4A4E3D]' : 'text-[#3D3B36]'}`}>
                    {indicator.label}
                  </h4>
                  <p className="text-[11px] text-[#8D887B] leading-relaxed">
                    {indicator.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Qualitative Field Anecdotal Notes */}
        <div className="space-y-2 pt-4 border-t border-[#F2EDE4]">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-[#4A4E3D]">
              Catatan Anekdotal Kualitatif (Log Kejadian Lapangan, Respon Pemicu, & Pola Khusus)
            </label>
            <span className="text-[11px] text-[#8D887B]">Deskripsikan alur interaksi secara naratif</span>
          </div>
          <textarea
            rows={4}
            value={anecdotalNotes}
            onChange={(e) =>
              onChangeData({
                ...observationData,
                anecdotalNotes: e.target.value,
              })
            }
            placeholder={`Tuliskan catatan kejadian nyata. Contoh:\n1. Saat lingkaran pagi, anak mengamati roda truk daripada menatap guru.\n2. Saat teman mendekat, anak memberikan balok sebagai sinyal bermain.\n3. Respon transisi: anak menolak saat bel berbunyi, namun tenang setelah diberikan timer pasir.`}
            className="w-full p-3.5 text-xs sm:text-sm bg-[#FDFCF7] border border-[#D9D4C7] rounded-2xl focus:ring-2 focus:ring-[#8B9A82] focus:bg-white text-[#3D3B36] leading-relaxed"
          />
        </div>

        {/* Custom Request to AI (Optional) */}
        <div className="p-4 rounded-2xl bg-[#F2EDE4] border border-[#D9D4C7] flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="shrink-0 flex items-center gap-1.5 text-xs font-bold text-[#4A4E3D]">
            <Zap className="w-4 h-4 text-[#C88E75]" />
            Permintaan Khusus ke AI:
          </div>
          <input
            type="text"
            value={customFocusPrompt}
            onChange={(e) => setCustomFocusPrompt(e.target.value)}
            placeholder="Misal: 'Fokuskan rekomendasi untuk strategi transisi di kelas yang ramai' atau 'Sertakan aktivitas Montessori sensorial'"
            className="flex-1 px-3.5 py-2 text-xs bg-white border border-[#D9D4C7] rounded-xl focus:ring-2 focus:ring-[#8B9A82] text-[#3D3B36]"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[#8D887B]">
            💡 Sistem akan memproses profil neuropsikologi fungsional & merancang diferensiasi kurikulum otomatis.
          </div>
          <button
            type="button"
            disabled={isLoading || !childMeta.childName}
            onClick={() => onAnalyze(customFocusPrompt)}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold text-sm shadow-xs flex items-center justify-center gap-2.5 transition-all ${
              isLoading || !childMeta.childName
                ? 'bg-[#D9D4C7] text-[#8D887B] cursor-not-allowed'
                : 'bg-[#5A5E4B] hover:bg-[#4A4E3D] text-white shadow-sm hover:shadow-md'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Menganalisis Pola Neuropsikologi Perkembangan...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-[#D9D4C7]" />
                <span>Analisis AI & Rancang Pembelajaran Personal</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
