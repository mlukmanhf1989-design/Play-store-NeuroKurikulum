import React from 'react';
import {
  BookOpen,
  Printer,
  X,
  Brain,
  Activity,
  Layers,
  CalendarCheck,
  CheckCircle2,
  HelpCircle,
  FileDown,
  Sparkles,
  ShieldCheck,
  Clock,
  Lightbulb,
} from 'lucide-react';

interface ManualGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManualGuideModal: React.FC<ManualGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#3D3B36]/70 backdrop-blur-xs overflow-y-auto p-3 sm:p-6 md:p-8 flex justify-center font-sans">
      {/* Floating Action Bar */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2 print:hidden">
        <button
          type="button"
          onClick={handlePrint}
          className="px-4 sm:px-5 py-2 sm:py-2.5 bg-[#5A5E4B] hover:bg-[#4A4E3D] text-white text-xs sm:text-sm font-bold rounded-2xl shadow-lg flex items-center gap-2 transition-all cursor-pointer"
        >
          <Printer className="w-4 h-4" /> Cetak / Unduh PDF Buku Petunjuk
        </button>
        <button
          type="button"
          onClick={onClose}
          className="p-2 sm:p-2.5 bg-white hover:bg-[#F2EDE4] text-[#4A4E3D] text-xs sm:text-sm font-bold rounded-2xl shadow-lg border border-[#D9D4C7] transition-colors cursor-pointer"
          title="Tutup Petunjuk"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Printable Sheet */}
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl p-6 sm:p-10 md:p-12 text-[#3D3B36] space-y-8 my-auto print:shadow-none print:p-0 print:m-0 print:max-w-none">
        
        {/* Document Header */}
        <div className="border-b-2 border-[#4A4E3D] pb-5 flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E8EADF] text-[#5A5E4B] border border-[#D3D8C8]">
              <BookOpen className="w-3.5 h-3.5 text-[#8B9A82]" />
              Panduan Operasional Pengguna & Metodologi Pedagogis
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-[#4A4E3D] tracking-tight">
              Buku Petunjuk Lengkap Aplikasi Kurikulum Berbasis Neuropsikologi
            </h1>
            <p className="text-xs sm:text-sm text-[#8D887B]">
              Panduan Komprehensif Asesmen Observasi Perkembangan Non-Diagnostik, Diferensiasi Kurikulum Merdeka & Desain PPI Terpadu
            </p>
          </div>
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#5A5E4B] text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
            <Brain className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
        </div>

        {/* Ethical Non-Diagnostic Mandate */}
        <div className="p-4 bg-[#F9EFEA] border border-[#EACBBF] rounded-2xl text-xs sm:text-sm text-[#B86B50] space-y-1.5 leading-relaxed">
          <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-xs">
            <ShieldCheck className="w-4 h-4 text-[#B86B50]" />
            Landasan Etis & Batasan Non-Diagnostik:
          </div>
          <p>
            Aplikasi ini dirancang khusus untuk <b>pemetaan pedagogis fungsional di lingkungan belajar</b> (sekolah/rumah) untuk membantu guru dan orang tua merancang diferensiasi instruksional. Aplikasi ini <b>BUKAN alat diagnosis medis, psikiatri, atau klinis</b> dan tidak menggantikan evaluasi dokter spesialis anak atau psikolog klinis.
          </p>
        </div>

        {/* Ringkasan 5 Langkah Alur */}
        <div className="space-y-4">
          <h2 className="text-base sm:text-lg font-serif font-bold text-[#4A4E3D] border-b border-[#E5DFD1] pb-1.5 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#8B9A82]" />
            Alur Kerja 5 Langkah Pembelajaran Personal
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
            <div className="p-3.5 bg-[#FDFCF7] border border-[#E5DFD1] rounded-2xl space-y-1">
              <span className="w-6 h-6 rounded-full bg-[#5A5E4B] text-white font-bold flex items-center justify-center text-xs">1</span>
              <p className="font-bold text-[#4A4E3D] text-xs">Input Observasi</p>
              <p className="text-[#8D887B] text-[11px]">Identitas, video, audio, catatan anekdot, & 6 domain.</p>
            </div>
            <div className="p-3.5 bg-[#FDFCF7] border border-[#E5DFD1] rounded-2xl space-y-1">
              <span className="w-6 h-6 rounded-full bg-[#8B9A82] text-white font-bold flex items-center justify-center text-xs">2</span>
              <p className="font-bold text-[#4A4E3D] text-xs">Profil Perkembangan</p>
              <p className="text-[#8D887B] text-[11px]">Radar chart, arketipe belajar, kekuatan, & skor domain.</p>
            </div>
            <div className="p-3.5 bg-[#FDFCF7] border border-[#E5DFD1] rounded-2xl space-y-1">
              <span className="w-6 h-6 rounded-full bg-[#5A5E4B] text-white font-bold flex items-center justify-center text-xs">3</span>
              <p className="font-bold text-[#4A4E3D] text-xs">Interpretasi Pedagogis</p>
              <p className="text-[#8D887B] text-[11px]">Ritme fokus, brain break, pemicu stres, & ko-regulasi.</p>
            </div>
            <div className="p-3.5 bg-[#FDFCF7] border border-[#E5DFD1] rounded-2xl space-y-1">
              <span className="w-6 h-6 rounded-full bg-[#8B9A82] text-white font-bold flex items-center justify-center text-xs">4</span>
              <p className="font-bold text-[#4A4E3D] text-xs">Diferensiasi Kurikulum</p>
              <p className="text-[#8D887B] text-[11px]">4 Pilar: Konten, Proses, Produk, & Lingkungan.</p>
            </div>
            <div className="p-3.5 bg-[#FDFCF7] border border-[#E5DFD1] rounded-2xl space-y-1">
              <span className="w-6 h-6 rounded-full bg-[#5A5E4B] text-white font-bold flex items-center justify-center text-xs">5</span>
              <p className="font-bold text-[#4A4E3D] text-xs">Desain PPI Personal</p>
              <p className="text-[#8D887B] text-[11px]">Aktivitas mikro, rubrik kualitatif, jadwal, & cetak PDF.</p>
            </div>
          </div>
        </div>

        {/* Detail Langkah Demi Langkah */}
        <div className="space-y-6 text-xs sm:text-sm">
          
          {/* Langkah 1 */}
          <div className="p-5 bg-[#FDFCF7] border border-[#E5DFD1] rounded-2xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#5A5E4B] text-white">Langkah 1</span>
              <h3 className="font-serif font-bold text-base text-[#4A4E3D]">Pengisian & Pengumpulan Data Observasi</h3>
            </div>
            <ul className="space-y-2 text-[#3D3B36] list-disc list-inside leading-relaxed">
              <li>
                <b>Pilih Contoh Kasus (Opsional):</b> Gunakan dropdown di header (contoh: Arga - 5 Thn Regulasi Sensori, Kinan - 4 Thn Dispraksia, Bima - 6 Thn Hiperfokus) untuk melihat contoh pengisian otomatis.
              </li>
              <li>
                <b>Data Identitas Anak:</b> Masukkan nama anak, usia (tahun & bulan), jenis kelamin, nama pengamat, peran (Guru Kelas/Orang Tua/Terapis), setting (Sentra Balok/Rumah/Taman), durasi observasi, dan kurikulum acuan (Kurikulum Merdeka PAUD, Montessori, Waldorf, dll).
              </li>
              <li>
                <b>Media Observasi Multisensori:</b> Unggah rekaman video perilaku (AI mendeteksi pola pergerakan & atensi), atau gunakan perekam suara langsung untuk mendiktekan pengamatan verbal.
              </li>
              <li>
                <b>Catatan Anekdot Terarah:</b> Tuliskan deskripsi peristiwa faktual (objektif) mengenai respons anak terhadap instruksi, teman sebaya, atau benda fisik.
              </li>
              <li>
                <b>Indikator Ceklis 6 Domain:</b> Pilih checklist perilaku yang teramati pada 6 domain:
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2 font-normal text-xs text-[#6B685F]">
                  <span className="p-2 bg-white rounded-xl border border-[#E5DFD1]">1. Atensi & Eksekutif</span>
                  <span className="p-2 bg-white rounded-xl border border-[#E5DFD1]">2. Motorik & Praksis</span>
                  <span className="p-2 bg-white rounded-xl border border-[#E5DFD1]">3. Bahasa & Komunikasi</span>
                  <span className="p-2 bg-white rounded-xl border border-[#E5DFD1]">4. Sosial-Emosional</span>
                  <span className="p-2 bg-white rounded-xl border border-[#E5DFD1]">5. Pemrosesan Sensori</span>
                  <span className="p-2 bg-white rounded-xl border border-[#E5DFD1]">6. Kognitif & Bermain</span>
                </div>
              </li>
              <li>
                <b>Proses Analisis:</b> Klik tombol <b>"Proses Analisis Observasi & Rancang Pembelajaran"</b>. AI akan memetakan seluruh data menjadi laporan neuropsikologi fungsional.
              </li>
            </ul>
          </div>

          {/* Langkah 2 */}
          <div className="p-5 bg-[#FDFCF7] border border-[#E5DFD1] rounded-2xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#8B9A82] text-white">Langkah 2</span>
              <h3 className="font-serif font-bold text-base text-[#4A4E3D]">Membaca Profil Neuroperkembangan</h3>
            </div>
            <ul className="space-y-2 text-[#3D3B36] list-disc list-inside leading-relaxed">
              <li>
                <b>Arketipe Gaya Belajar:</b> Menampilkan tipe pemrosesan belajar dominan anak (misal: <i>Kinestetik-Visual dengan Kebutuhan Proprioseptif</i>).
              </li>
              <li>
                <b>Radar Chart 6 Domain:</b> Visualisasi keseimbangan perkembangan menyeluruh dengan skor skala 0 - 100.
              </li>
              <li>
                <b>Kekuatan vs Dukungan Prioritas:</b> Memandu pendidik untuk selalu menggunakan pendekatan <i>strength-based</i> (memanfaatkan kekuatan anak untuk mendukung area yang masih berkembang).
              </li>
            </ul>
          </div>

          {/* Langkah 3 */}
          <div className="p-5 bg-[#FDFCF7] border border-[#E5DFD1] rounded-2xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#5A5E4B] text-white">Langkah 3</span>
              <h3 className="font-serif font-bold text-base text-[#4A4E3D]">Interpretasi Pedagogis & Pengaturan Lingkungan</h3>
            </div>
            <ul className="space-y-2 text-[#3D3B36] list-disc list-inside leading-relaxed">
              <li>
                <b>Pemrosesan Instruksi:</b> Cara terbaik memberikan instruksi kepada anak (misal: kalimat pendek satu tahap disertai gestur visual).
              </li>
              <li>
                <b>Ritme Fokus & Brain Break:</b> Durasi fokus optimal anak per sesi dan interval jeda aktif gerak (heavy work) untuk menyegarkan sistem saraf.
              </li>
              <li>
                <b>Pemicu Stres & Teknik Ko-Regulasi:</b> Mengenali sinyal kelelahan sensorik/kognitif dan langkah penenangan yang aman.
              </li>
            </ul>
          </div>

          {/* Langkah 4 */}
          <div className="p-5 bg-[#FDFCF7] border border-[#E5DFD1] rounded-2xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#8B9A82] text-white">Langkah 4</span>
              <h3 className="font-serif font-bold text-base text-[#4A4E3D]">Rekomendasi Diferensiasi Kurikulum</h3>
            </div>
            <ul className="space-y-2 text-[#3D3B36] list-disc list-inside leading-relaxed">
              <li>
                <b>Diferensiasi Konten:</b> Menyesuaikan tingkat kompleksitas materi atau memilih media konkret (loose parts/benda raba).
              </li>
              <li>
                <b>Diferensiasi Proses:</b> Cara belajar yang bervariasi (kinestetik, visual jadwal, kolaboratif, atau mandiri).
              </li>
              <li>
                <b>Diferensiasi Produk:</b> Pilihan cara anak menunjukkan pemahamannya (tidak hanya lembar kerja tulis, melainkan unjuk karya, rekaman suara, atau demonstrasi balok).
              </li>
              <li>
                <b>Diferensiasi Lingkungan:</b> Pengaturan pencahayaan, tingkat kebisingan, dan penataan sudut tenang (quiet corner).
              </li>
            </ul>
          </div>

          {/* Langkah 5 */}
          <div className="p-5 bg-[#FDFCF7] border border-[#E5DFD1] rounded-2xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#5A5E4B] text-white">Langkah 5</span>
              <h3 className="font-serif font-bold text-base text-[#4A4E3D]">Program Pembelajaran Individual (PPI) & Cetak PDF</h3>
            </div>
            <ul className="space-y-2 text-[#3D3B36] list-disc list-inside leading-relaxed">
              <li>
                <b>Target Capaian:</b> Target jangka pendek (1 - 4 minggu) dan jangka panjang (1 semester).
              </li>
              <li>
                <b>Skenario Aktivitas Mikro Terarah:</b> Langkah-langkah rinci aktivitas pembelajaran harian yang dilengkapi taktik scaffolding dan tips integrasi sensori.
              </li>
              <li>
                <b>Generator Aktivitas AI Tambahan:</b> Form khusus untuk meminta AI merancang aktivitas pembelajaran untuk materi pelajaran tertentu.
              </li>
              <li>
                <b>Rubrik Formatif Kualitatif (3 Tingkat):</b> Tolok ukur capaian Mulai Berkembang (MB), Berkembang Sesuai Harapan (BSH), dan Sangat Berkembang (SB).
              </li>
              <li>
                <b>Penyelarasan Rumah - Sekolah:</b> Rekomendasi aktivitas pendukung untuk orang tua di rumah agar selaras dengan pembelajaran di sekolah.
              </li>
            </ul>
          </div>

        </div>

        {/* Fitur Tambahan: Konsultan AI & Cetak PDF */}
        <div className="p-5 bg-[#F4F6F2] border border-[#D3D8C8] rounded-2xl space-y-3 text-xs sm:text-sm">
          <h3 className="font-serif font-bold text-[#4A4E3D] text-base flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-[#8B9A82]" />
            Fitur Pendukung Ekstra:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-white rounded-xl border border-[#E5DFD1] space-y-1">
              <span className="font-bold text-[#4A4E3D] block">🤖 Konsultan Pedagogi AI (Chat Interaktif):</span>
              <p className="text-[#6B685F] leading-relaxed">
                Klik tombol "Konsultan AI" di header untuk berdialog langsung dan meminta saran penanganan kasus kelas secara spesifik.
              </p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-[#E5DFD1] space-y-1">
              <span className="font-bold text-[#4A4E3D] block">🖨️ Cetak Dokumen Resmi / Simpan PDF:</span>
              <p className="text-[#6B685F] leading-relaxed">
                Klik tombol "Cetak Laporan" untuk membuka format siap cetak yang memuat seluruh analisis dan kolom tanda tangan resmi Guru, Kepala Sekolah, dan Orang Tua.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Dokumen */}
        <div className="pt-6 border-t border-[#D9D4C7] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#8D887B]">
          <p>© NeuroPedagogy.ID — Platform Asesmen Pedagogis Inklusif Indonesia</p>
          <p>Dokumen Panduan Operasional & Petunjuk Teknis</p>
        </div>

      </div>
    </div>
  );
};
