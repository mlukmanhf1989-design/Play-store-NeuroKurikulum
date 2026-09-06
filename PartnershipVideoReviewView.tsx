import React, { useState, useEffect } from 'react';
import {
  Video,
  Play,
  Pause,
  RotateCcw,
  Copy,
  Check,
  Phone,
  ExternalLink,
  Building2,
  Brain,
  Sparkles,
  ShieldCheck,
  Download,
  Share2,
  FileText,
  Clock,
  Layers,
  ChevronRight,
  ChevronLeft,
  GraduationCap,
  Users,
  Award,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  MessageSquare,
  Compass,
  Laptop,
  CheckCircle,
  Eye,
  Tv
} from 'lucide-react';

interface VideoScene {
  id: number;
  title: string;
  duration: string;
  sceneGoal: string;
  visualCue: string;
  screenFocus: string;
  lowerThirdText: string;
  voiceoverScript: string;
  keyPoints: string[];
}

export const PartnershipVideoReviewView: React.FC<{
  onNavigateToAssessment: () => void;
  onNavigateToDatabase: () => void;
  onNavigateToTalents: () => void;
  onNavigateToMajors: () => void;
}> = ({
  onNavigateToAssessment,
  onNavigateToDatabase,
  onNavigateToTalents,
  onNavigateToMajors,
}) => {
  const [activeTab, setActiveTab] = useState<'storyboard' | 'proposal' | 'prompter' | 'quickpitch'>('storyboard');
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(0);
  const [isPlayingPrompter, setIsPlayingPrompter] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const phoneNumber = '085815140585';
  const whatsappUrl = `https://wa.me/6285815140585?text=${encodeURIComponent(
    'Halo Tim IntegrEd Solution, saya tertarik dengan Program Kemitraan Lembaga Pendidikan & Implementasi Aplikasi Kurikulum Berbasis Neuropsikologi. Mohon informasi dan jadwal demo.'
  )}`;
  const trialProgramUrl = 'https://portal-login-kurikulum--firmansah1989.replit.app';

  const videoScenes: VideoScene[] = [
    {
      id: 1,
      title: 'Scene 1: Hook Pembuka & Masalah Nyata di Sekolah',
      duration: '00:00 - 00:25 (25 Detik)',
      sceneGoal: 'Menarik perhatian pimpinan sekolah, yayasan, dan guru terkait tantangan asesmen diferensiasi Kurikulum Merdeka.',
      visualCue: 'Presenter menyapa dengan hangat di samping laptop yang menampilkan antarmuka elegan Aplikasi Kurikulum Berbasis Neuropsikologi.',
      screenFocus: 'Halaman Utama & Header Branding Aplikasi Kurikulum Berbasis Neuropsikologi',
      lowerThirdText: 'IntegrEd Solution | Solusi Kurikulum & Asesmen Berbasis Neuropsikologi',
      voiceoverScript:
        'Halo Bapak/Ibu Pimpinan Lembaga Pendidikan, Kepala Sekolah, dan Rekan Pendidik di seluruh Indonesia! Apakah sekolah Anda masih kesulitan menyusun Program Pembelajaran Individual (PPI) dan melakukan asesmen diferensiasi yang benar-benar mengenali keunikan cara kerja otak setiap anak? Hari ini, IntegrEd Solution menghadirkan sebuah terobosan baru: "Aplikasi Kurikulum Berbasis Neuropsikologi", sebuah platform AI cerdas untuk memetakan potensi belajar, bakat majemuk, dan arah karir siswa secara presisi tanpa stigma.',
      keyPoints: [
        'Tantangan diferensiasi Kurikulum Merdeka',
        'Pendekatan ilmiah berbasis neuropsikologi non-diagnostik',
        'Kolaborasi resmi bersama IntegrEd Solution',
      ],
    },
    {
      id: 2,
      title: 'Scene 2: Filosofi Asesmen 5 Langkah Non-Diagnostik',
      duration: '00:25 - 00:55 (30 Detik)',
      sceneGoal: 'Menjelaskan alur observasi 5 langkah perkembangan anak yang mudah digunakan guru dan konselor.',
      visualCue: 'Screencast interaktif memperlihatkan pengisian formulir observasi 5 langkah: Sensori Motorik, Atensi & Eksekutif, Sosio-Emosional, Kognisi Bahasa, dan Lingkungan Belajar.',
      screenFocus: 'Menu Observasi Input & 5 Domain Perkembangan Kognitif',
      lowerThirdText: '5 Langkah Observasi Holistik | Non-Diagnostik & Berbasis Bukti Pedagogi',
      voiceoverScript:
        'Melalui alur 5 langkah observasi yang dirancang oleh konsorsium psikolog dan pakar kurikulum, guru dapat mengamati domain sensori-motorik, fungsi eksekutif, regulasi sosio-emosional, kognisi bahasa, hingga kesiapan lingkungan belajar siswa. Aplikasi ini menjamin pendekatan kekuatan positif (strength-based) sehingga anak tidak dilabeli kekurangan, melainkan dipahami gaya belajarnya.',
      keyPoints: [
        '5 Domain Perkembangan Otak & Kognitif',
        'Indikator observasi perilaku berbasis rubrik terukur',
        'Etika non-diagnostik yang aman bagi psikologis siswa',
      ],
    },
    {
      id: 3,
      title: 'Scene 3: Analisis AI Komprehensif & PPI Berdiferensiasi',
      duration: '00:55 - 01:30 (35 Detik)',
      sceneGoal: 'Mendemonstrasikan hasil sintesis AI dalam bentuk radar chart, adaptasi kurikulum, dan modul PPI mingguan.',
      visualCue: 'Layar beralih menampilkan grafik profil perkembangan, matriks diferensiasi konten-proses-produk, serta rincian rencana intervensi kelas.',
      screenFocus: 'Profil Perkembangan & Desain Diferensiasi Kurikulum',
      lowerThirdText: 'Sintesis AI Seketika | Adaptasi Konten, Proses, Produk & PPI Mingguan',
      voiceoverScript:
        'Hanya dalam hitungan detik, mesin AI menghasilkan profil neuropsikologi visual, rekomendasi adaptasi konten, proses, dan produk ajar, hingga panduan Program Pembelajaran Individual (PPI) bertahap. Bahkan, sistem otomatis menyusun pesan pendampingan ramah untuk dibagikan kepada orang tua murid di rumah!',
      keyPoints: [
        'Visualisasi Radar Kognitif 4 Kuadran',
        'Matriks Diferensiasi Konten, Proses & Produk',
        'Rencana Pembelajaran Terjadwal & Panduan Orang Tua',
      ],
    },
    {
      id: 4,
      title: 'Scene 4: Pemetaan Bakat Majemuk & Portofolio Prestasi',
      duration: '01:30 - 02:00 (30 Detik)',
      sceneGoal: 'Menampilkan integrasi 8 Kecerdasan Majemuk (Multiple Intelligences) dan rekam jejak prestasi siswa.',
      visualCue: 'Kamera menyorot tab "Pemetaan Bakat & Potensi" dan "Prestasi Siswa" dengan grafik persentase serta lencana juara.',
      screenFocus: 'Tab Bakat Majemuk & Portofolio Prestasi Siswa',
      lowerThirdText: 'Pemetaan 8+1 Kecerdasan Majemuk & Portofolio Prestasi Terpadu',
      voiceoverScript:
        'Tidak hanya aspek akademik, aplikasi ini juga memetakan 8 dimensi kecerdasan majemuk model Howard Gardner, mulai dari logika, spasial, kinestetik, hingga interpersonal. Setiap piagam dan rekam prestasi siswa diintegrasikan langsung untuk memperkuat rasa percaya diri dan portofolio anak.',
      keyPoints: [
        'Analisis 8+1 Dimensi Multiple Intelligences',
        'Rekomendasi ekstrakurikuler & lomba kompetisi tepat sasaran',
        'Pelacakan prestasi akademik, sains, seni & olahraga',
      ],
    },
    {
      id: 5,
      title: 'Scene 5: Peminatan Program Studi & Karir Masa Depan (SMA)',
      duration: '02:00 - 02:30 (30 Detik)',
      sceneGoal: 'Memperlihatkan kecocokan karir, jurusan kuliah, dan mata pelajaran pilihan SMA fase E/F.',
      visualCue: 'Kamera menampilkan dashboard rekomendasi klaster jurusan kuliah (SNBP/SNBT), skor kecocokan persentase, dan tips bimbingan karir.',
      screenFocus: 'Modul Rekomendasi Peminatan Kuliah & Karir SMA',
      lowerThirdText: 'Bimbingan Karir & Peminatan Kuliah SMA | Selaras SNBP & SNBT',
      voiceoverScript:
        'Bagi jenjang SMA, fitur Peminatan Program Studi secara otomatis mengombinasikan profil kognitif, prestasi, dan bakat siswa untuk merekomendasikan klaster jurusan kuliah dan karir masa depan dengan tingkat kecocokan yang tinggi. Ini menjadi instrumen berharga bagi Guru BK dalam membimbing pemilihan mata pelajaran tingkat lanjut.',
      keyPoints: [
        'Analisis kompatibilitas program studi perguruan tinggi',
        'Korelasi mata pelajaran pendukung seleksi SNBP/SNBT',
        'Prospek industri masa depan berbasis data kognitif',
      ],
    },
    {
      id: 6,
      title: 'Scene 6: Manajemen Database & Akses Multi-Peran (RBAC)',
      duration: '02:30 - 03:00 (30 Detik)',
      sceneGoal: 'Menunjukkan keamanan data, akun lembaga gratis 3 siswa, dan panel review server pusat.',
      visualCue: 'Menampilkan halaman "Database Siswa Baru", menu login berjenjang, dan panel server utama.',
      screenFocus: 'Database Siswa, Kuota Lembaga & Sistem Hak Akses',
      lowerThirdText: 'Role-Based Access Control | Kuota Lembaga & Keamanan Data Siswa',
      voiceoverScript:
        'Aplikasi ini dibangun dengan sistem keamanan Role-Based Access Control. Lembaga pendidikan dapat mendaftar dan mengelola hingga 3 siswa secara mandiri pada program trial. Sedangkan tim server pusat dan psikolog memiliki audit log lengkap untuk menjaga kualitas dan validitas pedagogis.',
      keyPoints: [
        'Program Trial Mandiri untuk Lembaga Pendidikan',
        'Manajemen arsip data siswa terpusat',
        'Audit log server & perlindungan privasi siswa',
      ],
    },
    {
      id: 7,
      title: 'Scene 7: Manfaat Program Kemitraan Bersama IntegrEd Solution',
      duration: '03:00 - 03:30 (30 Detik)',
      sceneGoal: 'Menawarkan paket kemitraan strategis, bimbingan teknis guru, dan pendampingan implementasi kurikulum.',
      visualCue: 'Grafik infografis kemitraan: Training Guru, Akses Portal Sekolah, Pendampingan Kurikulum, Layanan Konsultasi Psikolog.',
      screenFocus: 'Paket Kemitraan Sekolah & IntegrEd Solution',
      lowerThirdText: 'Paket Kemitraan Lengkap: Workshop Guru, Lisensi Sekolah & Pendampingan Ahli',
      voiceoverScript:
        'Melalui Program Kemitraan resmi bersama IntegrEd Solution, sekolah Anda tidak hanya mendapatkan akses penuh ke platform ini, tetapi juga workshop intensif untuk dewan guru, pendampingan penyusunan modul ajar berdiferensiasi, serta sesi konsultasi berkala dengan tim psikolog perkembangan kami.',
      keyPoints: [
        'Workshop Sertifikasi Asesmen Diferensiasi untuk Guru',
        'Penyediaan Dokumen Laporan Siap Cetak (PDF Resmi)',
        'Dukungan Teknis & Konsultasi Ahli Berkelanjutan',
      ],
    },
    {
      id: 8,
      title: 'Scene 8: Call To Action & Kontak Kemitraan',
      duration: '03:30 - 04:00 (30 Detik)',
      sceneGoal: 'Mengarahkan pemirsa untuk mencoba trial gratis dan menghubungi hotline IntegrEd Solution.',
      visualCue: 'Layar penutup elegan menampilkan Logo IntegrEd Solution, Nomor WhatsApp/Telepon 085815140585, dan URL Trial Program.',
      screenFocus: 'Contact Card & Tombol Uji Coba Trial Program',
      lowerThirdText: 'Hubungi IntegrEd Solution: 085815140585 | Coba Trial Sekarang!',
      voiceoverScript:
        'Mari wujudkan ekosistem sekolah yang adaptif dan memanusiakan setiap potensi anak. Uji coba langsung program trial kami di portal-login-kurikulum--firmansah1989.replit.app, atau hubungi tim kemitraan IntegrEd Solution sekarang juga di nomor 0858-1514-0585. IntegrEd Solution: Mengakselerasi Potensi Belajar Berbasis Sains Otak.',
      keyPoints: [
        'Hotline Resmi WhatsApp: 085815140585',
        'Trial Portal: https://portal-login-kurikulum--firmansah1989.replit.app',
        'Konsultasi Gratis Demo untuk Sekolah & Yayasan',
      ],
    },
  ];

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const getFullScriptText = () => {
    return `=== NASKAH VIDEO REVIEW APLIKASI KURIKULUM BERBASIS NEUROPSIKOLOGI ===
PROGRAM KEMITRAAN LEMBAGA PENDIDIKAN DENGAN INTEGR-ED SOLUTION
Hotline Kemitraan: 085815140585 (WhatsApp/Telp)
Trial Program URL: https://portal-login-kurikulum--firmansah1989.replit.app

${videoScenes
  .map(
    (s) => `------------------------------------------------------------
[${s.title}] (Durasi: ${s.duration})
Visual & Fokus: ${s.screenFocus}
Teks Layar (Lower Third): ${s.lowerThirdText}
Narasi Suara (Voiceover):
"${s.voiceoverScript}"
Key Takeaways: ${s.keyPoints.join(' • ')}
`
  )
  .join('\n')}
============================================================
Deskripsi Video YouTube / Media Sosial:
Judul: Review Lengkap Aplikasi Kurikulum Berbasis Neuropsikologi - Solusi Asesmen Diferensiasi & Bakat Anak | Kemitraan IntegrEd Solution
Hubungi Program Kemitraan Sekolah:
📞 WhatsApp/Telp: 085815140585
🌐 Uji Coba Demo Portal: https://portal-login-kurikulum--firmansah1989.replit.app
#KurikulumMerdeka #Neuropsikologi #AsesmenDiferensiasi #IntegrEdSolution #BakatAnak #GuruPenggerak #PendidikanInklusif`;
  };

  const currentScene = videoScenes[currentSceneIndex];

  // Auto-play prompter timer simulation
  useEffect(() => {
    let interval: any;
    if (isPlayingPrompter) {
      interval = setInterval(() => {
        setCurrentSceneIndex((prev) => (prev + 1) % videoScenes.length);
      }, 12000);
    }
    return () => clearInterval(interval);
  }, [isPlayingPrompter, videoScenes.length]);

  return (
    <div id="partnership-video-review-view" className="space-y-8 animate-fadeIn pb-16">
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1E3A2F] via-[#2A4D3E] to-[#162D24] text-white rounded-3xl p-6 sm:p-10 shadow-lg border border-[#3E6554]">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>Paket Video Review & Program Kemitraan Resmi</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-serif font-bold tracking-tight text-white leading-tight">
            Review Aplikasi Kurikulum Berbasis Neuropsikologi & Kemitraan IntegrEd Solution
          </h2>

          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed max-w-3xl">
            Panduan lengkap naskah video review berdurasi 4 menit, storyboard visual, teleprompter interaktif, dan proposal kemitraan institusi pendidikan bersama <strong>IntegrEd Solution</strong>.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold text-sm shadow-sm transition-all transform hover:-translate-y-0.5"
            >
              <Phone className="w-4 h-4" />
              <span>Hubungi Tim Kemitraan (085815140585)</span>
            </a>

            <a
              href={trialProgramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-sm font-semibold transition-all"
            >
              <ExternalLink className="w-4 h-4 text-emerald-300" />
              <span>Buka Portal Trial Online</span>
            </a>

            <button
              onClick={() => copyText(getFullScriptText(), 'full-script')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-sm font-semibold transition-all cursor-pointer"
            >
              {copiedKey === 'full-script' ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Naskah Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Salin Seluruh Naskah Video</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-[#E6DFD5] bg-[#F4EFE6] px-4 pt-2 gap-2 overflow-x-auto rounded-t-2xl">
        <button
          onClick={() => setActiveTab('storyboard')}
          className={`px-4 py-3 text-xs sm:text-sm font-bold rounded-t-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'storyboard'
              ? 'bg-white text-[#1F2937] border-t-2 border-[#1E3A2F] shadow-xs'
              : 'text-[#6C6659] hover:text-[#1F2937]'
          }`}
        >
          <Video className="w-4 h-4 text-[#1E3A2F]" />
          <span>Storyboard & Naskah Per Adegan (8 Scene)</span>
        </button>

        <button
          onClick={() => setActiveTab('prompter')}
          className={`px-4 py-3 text-xs sm:text-sm font-bold rounded-t-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'prompter'
              ? 'bg-white text-[#1F2937] border-t-2 border-[#1E3A2F] shadow-xs'
              : 'text-[#6C6659] hover:text-[#1F2937]'
          }`}
        >
          <Tv className="w-4 h-4 text-purple-600" />
          <span>Teleprompter & Simulasi Video Presenter</span>
        </button>

        <button
          onClick={() => setActiveTab('proposal')}
          className={`px-4 py-3 text-xs sm:text-sm font-bold rounded-t-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'proposal'
              ? 'bg-white text-[#1F2937] border-t-2 border-[#1E3A2F] shadow-xs'
              : 'text-[#6C6659] hover:text-[#1F2937]'
          }`}
        >
          <Building2 className="w-4 h-4 text-blue-600" />
          <span>Proposal & Skema Kemitraan Lembaga</span>
        </button>

        <button
          onClick={() => setActiveTab('quickpitch')}
          className={`px-4 py-3 text-xs sm:text-sm font-bold rounded-t-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'quickpitch'
              ? 'bg-white text-[#1F2937] border-t-2 border-[#1E3A2F] shadow-xs'
              : 'text-[#6C6659] hover:text-[#1F2937]'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-amber-600" />
          <span>Copywriting Promosi & Pesan Broadcast WA</span>
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="bg-white border border-[#E6DFD5] rounded-b-2xl p-6 sm:p-8 shadow-xs">
        {/* TAB 1: STORYBOARD & NASKAH SCENE BY SCENE */}
        {activeTab === 'storyboard' && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#FAF7F2] p-4 rounded-2xl border border-[#E5DFD1]">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#2A261F]">
                  Rangkaian Naskah & Alur Video (Total Durasi: 4 Menit)
                </h3>
                <p className="text-xs text-[#6C6659]">
                  Dirancang khusus untuk presentasi direktur yayasan, kepala sekolah, guru penggerak, dan postingan channel YouTube/TikTok institusi.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => copyText(getFullScriptText(), 'full-storyboard-script')}
                  className="px-3.5 py-2 bg-[#1E3A2F] hover:bg-[#162D24] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                >
                  {copiedKey === 'full-storyboard-script' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>Salin Semua Naskah</span>
                </button>
              </div>
            </div>

            {/* Scenes Grid */}
            <div className="space-y-6">
              {videoScenes.map((scene, idx) => (
                <div
                  key={scene.id}
                  className="bg-[#FAF8F5] border border-[#E6DFD5] hover:border-[#1E3A2F]/40 rounded-2xl p-5 sm:p-6 transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E6DFD5] pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#1E3A2F] text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-base text-[#1F2937]">{scene.title}</h4>
                        <div className="flex items-center gap-2 text-xs text-[#6C6659] mt-0.5">
                          <Clock className="w-3.5 h-3.5 text-[#1E3A2F]" />
                          <span>{scene.duration}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-white border border-[#D8D2C5] text-[#1E3A2F] font-bold text-[11px] rounded-lg">
                        {scene.screenFocus}
                      </span>
                      <button
                        onClick={() => copyText(scene.voiceoverScript, `voice-${scene.id}`)}
                        className="px-2.5 py-1 bg-white hover:bg-gray-100 border border-[#D8D2C5] text-gray-700 text-[11px] font-semibold rounded-lg flex items-center gap-1"
                        title="Salin narasi scene ini"
                      >
                        {copiedKey === `voice-${scene.id}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>Salin Narasi</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    {/* Left: Script Voiceover */}
                    <div className="lg:col-span-8 space-y-2.5">
                      <div className="text-xs font-bold uppercase tracking-wider text-[#1E3A2F] flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Naskah Suara / Voiceover (Presenter)</span>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-[#E6DFD5] text-sm text-[#2A261F] font-serif leading-relaxed italic">
                        "{scene.voiceoverScript}"
                      </div>
                    </div>

                    {/* Right: Technical Cues & Lower Third */}
                    <div className="lg:col-span-4 space-y-3 bg-white p-4 rounded-xl border border-[#E6DFD5]">
                      <div>
                        <div className="text-[11px] font-bold text-[#8D887B] uppercase tracking-wider">
                          Petunjuk Visual / Screencast:
                        </div>
                        <p className="text-xs text-[#4A453A] mt-1 leading-relaxed">{scene.visualCue}</p>
                      </div>

                      <div className="pt-2 border-t border-[#E6DFD5]">
                        <div className="text-[11px] font-bold text-[#8D887B] uppercase tracking-wider">
                          Teks Di Layar (Lower Third):
                        </div>
                        <div className="text-xs font-mono font-bold text-[#1E3A2F] bg-[#E8F0EC] p-2 rounded-lg mt-1">
                          {scene.lowerThirdText}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#E6DFD5]">
                        <div className="text-[11px] font-bold text-[#8D887B] uppercase tracking-wider mb-1">
                          Poin Kunci:
                        </div>
                        <ul className="text-[11px] text-[#6C6659] space-y-1 list-disc list-inside">
                          {scene.keyPoints.map((pt, pIdx) => (
                            <li key={pIdx}>{pt}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: TELEPROMPTER INTERAKTIF */}
        {activeTab === 'prompter' && (
          <div className="space-y-6">
            <div className="bg-[#1F2937] text-white p-6 rounded-2xl border border-gray-700 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-700 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                    <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">
                      Studio Teleprompter Simulator
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-white mt-1">
                    {currentScene.title}
                  </h3>
                  <div className="text-xs text-gray-300">
                    Durasi: {currentScene.duration} • Fokus: {currentScene.screenFocus}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setCurrentSceneIndex((prev) => Math.max(0, prev - 1))}
                    disabled={currentSceneIndex === 0}
                    className="p-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 text-white rounded-xl border border-gray-600 cursor-pointer"
                    title="Scene Sebelumnya"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => setIsPlayingPrompter(!isPlayingPrompter)}
                    className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                      isPlayingPrompter
                        ? 'bg-amber-500 hover:bg-amber-400 text-gray-950'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    {isPlayingPrompter ? (
                      <>
                        <Pause className="w-4 h-4" />
                        <span>Jeda Simulasi</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        <span>Mulai Putar Naskah Otomatis</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setCurrentSceneIndex((prev) => Math.min(videoScenes.length - 1, prev + 1))}
                    disabled={currentSceneIndex === videoScenes.length - 1}
                    className="p-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 text-white rounded-xl border border-gray-600 cursor-pointer"
                    title="Scene Berikutnya"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Large Prompter Narration View */}
              <div className="my-8 py-6 px-4 sm:px-8 bg-black/60 rounded-2xl border border-gray-800 text-center space-y-4">
                <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
                  NASKAH BACA PRESENTER (SCENE {currentScene.id} DARI {videoScenes.length})
                </div>
                <p className="text-lg sm:text-2xl md:text-3xl font-serif text-white leading-relaxed tracking-wide font-medium">
                  "{currentScene.voiceoverScript}"
                </p>
                <div className="inline-block px-4 py-1.5 bg-emerald-950 text-emerald-300 border border-emerald-600/40 rounded-full text-xs font-mono">
                  Display Teks: {currentScene.lowerThirdText}
                </div>
              </div>

              {/* Scene Timeline Dots */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 pt-2">
                {videoScenes.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => setCurrentSceneIndex(idx)}
                    className={`p-2 rounded-xl text-left transition-all border text-xs cursor-pointer ${
                      currentSceneIndex === idx
                        ? 'bg-emerald-900/60 border-emerald-400 text-white ring-1 ring-emerald-400'
                        : 'bg-gray-800/80 border-gray-700 text-gray-400 hover:text-white'
                    }`}
                  >
                    <div className="font-bold text-[11px]">Scene {s.id}</div>
                    <div className="truncate text-[10px] text-gray-300 mt-0.5">{s.title.split(':')[1] || s.title}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PROPOSAL & SKEMA KEMITRAAN LEMBAGA */}
        {activeTab === 'proposal' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-[#FAF7F2] to-[#EBF3EE] border border-[#D8D2C5] rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2.5 text-[#1E3A2F] font-bold text-sm">
                <Building2 className="w-5 h-5" />
                <span>Format Kemitraan Institusi Pendidikan & IntegrEd Solution</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#1F2937]">
                Program Akselerasi Diferensiasi & Asesmen Berbasis Neuropsikologi
              </h3>
              <p className="text-xs sm:text-sm text-[#6C6659] leading-relaxed max-w-3xl">
                IntegrEd Solution membuka kemitraan strategis dengan Sekolah (PAUD, SD, SMP, SMA/SMK), Yayasan Pendidikan, Pusat Kegiatan Belajar Masyarakat (PKBM), dan Lembaga Bimbingan Belajar di seluruh Indonesia.
              </p>
            </div>

            {/* 3 Pillars of Partnership */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#FAF8F5] border border-[#E6DFD5] rounded-2xl p-5 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800">
                  <Laptop className="w-5 h-5" />
                </div>
                <h4 className="font-serif font-bold text-base text-[#1F2937]">1. Lisensi & Portal Sekolah</h4>
                <ul className="text-xs text-[#6C6659] space-y-2 list-disc list-inside">
                  <li>Portal mandiri terdedikasi untuk sekolah/yayasan.</li>
                  <li>Database siswa tanpa batasan kuota.</li>
                  <li>Fitur cetak laporan PPI & Laporan Orang Tua berlogo resmi sekolah.</li>
                  <li>Sistem keamanan data terlindungi.</li>
                </ul>
              </div>

              <div className="bg-[#FAF8F5] border border-[#E6DFD5] rounded-2xl p-5 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-300 flex items-center justify-center text-blue-800">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h4 className="font-serif font-bold text-base text-[#1F2937]">2. Pelatihan & Sertifikasi Guru</h4>
                <ul className="text-xs text-[#6C6659] space-y-2 list-disc list-inside">
                  <li>Workshop "Observasi Kognitif & Diferensiasi Kurikulum Merdeka".</li>
                  <li>Bimbingan penyusunan Modul Ajar dan Rubrik Asesmen.</li>
                  <li>Pelatihan konselor BK untuk pemetaan minat karir SMA.</li>
                  <li>Sertifikat resmi kemitraan profesional.</li>
                </ul>
              </div>

              <div className="bg-[#FAF8F5] border border-[#E6DFD5] rounded-2xl p-5 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 border border-purple-300 flex items-center justify-center text-purple-800">
                  <Brain className="w-5 h-5" />
                </div>
                <h4 className="font-serif font-bold text-base text-[#1F2937]">3. Pendampingan Psikolog Klinis</h4>
                <ul className="text-xs text-[#6C6659] space-y-2 list-disc list-inside">
                  <li>Konsultasi berkala untuk kasus siswa berkebutuhan khusus/inklusif.</li>
                  <li>Review kurasi data oleh psikolog perkembangan.</li>
                  <li>Webinar parenting berkala untuk wali murid sekolah mitra.</li>
                  <li>Hotline bimbingan teknis prioritas.</li>
                </ul>
              </div>
            </div>

            {/* Trial Program & Contact Card */}
            <div className="bg-[#1E3A2F] text-white p-6 sm:p-8 rounded-2xl flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-bold">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Program Trial Mandiri Tersedia Sekarang</span>
                </div>
                <h4 className="text-xl sm:text-2xl font-serif font-bold text-white">
                  Ingin Mengajukan Uji Coba atau Demo Presentasi Sekolah?
                </h4>
                <p className="text-xs sm:text-sm text-emerald-100/80 max-w-xl">
                  Hubungi perwakilan kemitraan IntegrEd Solution sekarang. Kami siap hadir secara daring maupun luring untuk presentasi di sekolah/yayasan Anda.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-gray-950 rounded-xl font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition-all"
                >
                  <Phone className="w-4 h-4" />
                  <span>WhatsApp: 085815140585</span>
                </a>
                <a
                  href={trialProgramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold text-sm border border-white/20 flex items-center justify-center gap-2 transition-all"
                >
                  <ExternalLink className="w-4 h-4 text-emerald-300" />
                  <span>Kunjungi Trial Portal</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: QUICK PITCH & BROADCAST COPYWRITING */}
        {activeTab === 'quickpitch' && (
          <div className="space-y-6">
            <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-xs sm:text-sm text-amber-950 flex items-start gap-3">
              <MessageSquare className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Template Pesan Singkat & Broadcast Kemitraan (WhatsApp & Email)</p>
                <p className="text-xs text-amber-900 mt-1 leading-relaxed">
                  Gunakan format pesan siap kirim di bawah ini untuk sosialisasi ke grup Kepala Sekolah, Pengawas Sekolah, Yayasan, dan Komite Guru.
                </p>
              </div>
            </div>

            {/* WhatsApp Pitch Template */}
            <div className="bg-[#FAF8F5] border border-[#E6DFD5] rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-[#E6DFD5] pb-2.5">
                <div className="font-serif font-bold text-sm text-[#1F2937]">
                  Format Broadcast WhatsApp untuk Pimpinan Sekolah
                </div>
                <button
                  onClick={() =>
                    copyText(
                      `Yth. Bapak/Ibu Pimpinan Lembaga Pendidikan & Rekan Guru,\n\nApakah sekolah Anda ingin mengimplementasikan asesmen diferensiasi Kurikulum Merdeka yang berbasis sains cara kerja otak (neuropsikologi) tanpa repot?\n\nIntegrEd Solution mempersembahkan: "Aplikasi Kurikulum Berbasis Neuropsikologi"\n✨ Fitur Unggulan:\n1. Asesmen 5 Langkah Non-Diagnostik ramah anak\n2. Rekomendasi Modul PPI & Diferensiasi Konten/Proses/Produk otomatis\n3. Pemetaan 8 Kecerdasan Majemuk (Multiple Intelligences) & Rekam Prestasi\n4. Rekomendasi Peminatan Jurusan Kuliah & Karir SMA (SNBP/SNBT)\n5. Cetak Laporan Resmi untuk Sekolah & Orang Tua\n\n📌 Uji Coba Program Trial: ${trialProgramUrl}\n📞 Konsultasi & Program Kemitraan Sekolah:\nWhatsApp: 085815140585 (IntegrEd Solution)\n\nMari bersama wujudkan sekolah inklusif yang mengenali keunikan setiap anak!`,
                      'wa-pitch'
                    )
                  }
                  className="px-3 py-1.5 bg-[#1E3A2F] text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === 'wa-pitch' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Salin Pesan WA</span>
                </button>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#E6DFD5] text-xs font-mono text-[#2A261F] whitespace-pre-wrap leading-relaxed">
{`Yth. Bapak/Ibu Pimpinan Lembaga Pendidikan & Rekan Guru,

Apakah sekolah Anda ingin mengimplementasikan asesmen diferensiasi Kurikulum Merdeka yang berbasis sains cara kerja otak (neuropsikologi) tanpa repot?

IntegrEd Solution mempersembahkan: "Aplikasi Kurikulum Berbasis Neuropsikologi"
✨ Fitur Unggulan:
1. Asesmen 5 Langkah Non-Diagnostik ramah anak
2. Rekomendasi Modul PPI & Diferensiasi Konten/Proses/Produk otomatis
3. Pemetaan 8 Kecerdasan Majemuk (Multiple Intelligences) & Rekam Prestasi
4. Rekomendasi Peminatan Jurusan Kuliah & Karir SMA (SNBP/SNBT)
5. Cetak Laporan Resmi untuk Sekolah & Orang Tua

📌 Uji Coba Program Trial: ${trialProgramUrl}
📞 Konsultasi & Program Kemitraan Sekolah:
WhatsApp: ${phoneNumber} (IntegrEd Solution)

Mari bersama wujudkan sekolah inklusif yang mengenali keunikan setiap anak!`}
              </div>
            </div>

            {/* YouTube Description Template */}
            <div className="bg-[#FAF8F5] border border-[#E6DFD5] rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-[#E6DFD5] pb-2.5">
                <div className="font-serif font-bold text-sm text-[#1F2937]">
                  Deskripsi Video YouTube & Metadata Video Review
                </div>
                <button
                  onClick={() =>
                    copyText(
                      `Review Resmi Aplikasi Kurikulum Berbasis Neuropsikologi\nSolusi Asesmen Diferensiasi, Pemetaan Bakat & Bimbingan Karir Siswa\n\nKemitraan Resmi Lembaga Pendidikan bersama IntegrEd Solution:\n📞 Hotline/WhatsApp: 085815140585\n🌐 Trial Program: ${trialProgramUrl}\n\n#KurikulumMerdeka #AsesmenDiferensiasi #Neuropsikologi #IntegrEdSolution #BakatAnak #GuruBK #SekolahPenggerak`,
                      'yt-desc'
                    )
                  }
                  className="px-3 py-1.5 bg-[#1E3A2F] text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === 'yt-desc' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Salin Deskripsi YouTube</span>
                </button>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#E6DFD5] text-xs font-mono text-[#2A261F] whitespace-pre-wrap leading-relaxed">
{`Review Resmi Aplikasi Kurikulum Berbasis Neuropsikologi
Solusi Asesmen Diferensiasi, Pemetaan Bakat & Bimbingan Karir Siswa

Kemitraan Resmi Lembaga Pendidikan bersama IntegrEd Solution:
📞 Hotline/WhatsApp: ${phoneNumber}
🌐 Trial Program: ${trialProgramUrl}

#KurikulumMerdeka #AsesmenDiferensiasi #Neuropsikologi #IntegrEdSolution #BakatAnak #GuruBK #SekolahPenggerak`}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
