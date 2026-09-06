import React, { useState } from 'react';
import { StudentAchievement, StudentMasterRecord, AchievementCategory, AchievementLevel } from '../types';
import {
  Trophy,
  PlusCircle,
  Search,
  Filter,
  Medal,
  Award,
  Sparkles,
  ExternalLink,
  Trash2,
  CheckCircle2,
  Calendar,
  X,
  Printer
} from 'lucide-react';

interface StudentAchievementsViewProps {
  achievements: StudentAchievement[];
  students: StudentMasterRecord[];
  onAddAchievement: (achievement: StudentAchievement) => void;
  onDeleteAchievement: (id: string) => void;
  selectedStudentFilter?: string | null;
  onClearStudentFilter?: () => void;
}

export const StudentAchievementsView: React.FC<StudentAchievementsViewProps> = ({
  achievements,
  students,
  onAddAchievement,
  onDeleteAchievement,
  selectedStudentFilter,
  onClearStudentFilter,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [levelFilter, setLevelFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [selectedStudentId, setSelectedStudentId] = useState(
    selectedStudentFilter || (students.length > 0 ? students[0].id : '')
  );
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<AchievementCategory>('Akademik / Sains');
  const [level, setLevel] = useState<AchievementLevel>('Nasional');
  const [rank, setRank] = useState('Juara 1 (Medali Emas)');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [organizer, setOrganizer] = useState('');
  const [description, setDescription] = useState('');
  const [certificateUrl, setCertificateUrl] = useState('');

  const filteredAchievements = achievements.filter((ach) => {
    const matchesSearch =
      ach.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ach.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ach.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ach.rank.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'ALL' || ach.category === categoryFilter;
    const matchesLevel = levelFilter === 'ALL' || ach.level === levelFilter;
    const matchesStudent = !selectedStudentFilter || ach.studentId === selectedStudentFilter;

    return matchesSearch && matchesCategory && matchesLevel && matchesStudent;
  });

  const countTotal = achievements.length;
  const countInternasional = achievements.filter((a) => a.level === 'Internasional').length;
  const countNasional = achievements.filter((a) => a.level === 'Nasional').length;
  const countProvinsi = achievements.filter((a) => a.level === 'Provinsi').length;
  const countKota = achievements.filter((a) => a.level === 'Kota/Kabupaten' || a.level === 'Sekolah' || a.level === 'Kecamatan').length;

  const handleOpenAdd = () => {
    setSelectedStudentId(selectedStudentFilter || (students.length > 0 ? students[0].id : ''));
    setTitle('');
    setCategory('Akademik / Sains');
    setLevel('Nasional');
    setRank('Juara 1 (Medali Emas)');
    setYear(new Date().getFullYear().toString());
    setOrganizer('');
    setDescription('');
    setCertificateUrl('');
    setIsModalOpen(true);
  };

  const handleSaveAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !selectedStudentId) return;

    const targetStudent = students.find((s) => s.id === selectedStudentId);

    const newAch: StudentAchievement = {
      id: `ach-${Date.now()}`,
      studentId: selectedStudentId,
      studentName: targetStudent?.fullName || 'Siswa Berprestasi',
      educationLevel: targetStudent?.educationLevel || 'SMA',
      gradeClass: targetStudent?.gradeClass || 'Kelas Siswa',
      title,
      category,
      level,
      rank,
      year,
      organizer: organizer || 'Kemendikbudristek / Lembaga Resmi',
      description,
      certificateUrl: certificateUrl || undefined,
      dateRecorded: new Date().toISOString().split('T')[0],
    };

    onAddAchievement(newAch);
    setIsModalOpen(false);
  };

  const currentFilteredStudentObj = selectedStudentFilter
    ? students.find((s) => s.id === selectedStudentFilter)
    : null;

  return (
    <div id="student-achievements-view" className="space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="bg-[#FAF7F2] border border-[#E5DFD1] rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-900 rounded-full text-xs font-semibold mb-2">
              <Trophy className="w-3.5 h-3.5 text-amber-600" /> Pusat Portofolio & Rekam Prestasi Anak
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#2A261F]">
              Galeri Prestasi & Capaian Unggulan Siswa
            </h1>
            <p className="text-sm text-[#6C6659] mt-1 max-w-3xl">
              Dokumentasi terstruktur rekam jejak prestasi akademik, sains, seni budaya, olahraga, robotika, dan kepemimpinan untuk portofolio SNBP, beasiswa, dan peminatan karir masa depan.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-add-achievement"
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#8A5A36] hover:bg-[#724a2c] text-white font-medium text-sm rounded-xl shadow-sm transition-all"
            >
              <PlusCircle className="w-4 h-4" /> Catat Prestasi Baru
            </button>
          </div>
        </div>

        {/* Selected Student Filter Notice */}
        {currentFilteredStudentObj && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Menampilkan khusus prestasi untuk siswa: <strong>{currentFilteredStudentObj.fullName}</strong> ({currentFilteredStudentObj.educationLevel} - {currentFilteredStudentObj.gradeClass})
              </span>
            </div>
            {onClearStudentFilter && (
              <button
                onClick={onClearStudentFilter}
                className="text-xs font-bold text-amber-800 hover:text-amber-950 underline ml-3 shrink-0"
              >
                Tampilkan Semua Prestasi
              </button>
            )}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-6 border-t border-[#E5DFD1]">
          <div className="bg-white border border-[#E5DFD1] p-3 rounded-xl">
            <div className="text-xs text-[#8D887B] font-medium">Total Prestasi</div>
            <div className="text-2xl font-bold font-serif text-[#2A261F] mt-0.5">{countTotal}</div>
          </div>
          <div className="bg-white border border-[#E5DFD1] p-3 rounded-xl">
            <div className="text-xs text-purple-700 font-medium">Internasional</div>
            <div className="text-2xl font-bold font-serif text-purple-900 mt-0.5">{countInternasional}</div>
          </div>
          <div className="bg-white border border-[#E5DFD1] p-3 rounded-xl">
            <div className="text-xs text-emerald-700 font-medium">Nasional (OSN/O2SN)</div>
            <div className="text-2xl font-bold font-serif text-emerald-900 mt-0.5">{countNasional}</div>
          </div>
          <div className="bg-white border border-[#E5DFD1] p-3 rounded-xl">
            <div className="text-xs text-blue-700 font-medium">Tingkat Provinsi</div>
            <div className="text-2xl font-bold font-serif text-blue-900 mt-0.5">{countProvinsi}</div>
          </div>
          <div className="bg-white border border-[#E5DFD1] p-3 rounded-xl">
            <div className="text-xs text-amber-700 font-medium">Kota / Sekolah</div>
            <div className="text-2xl font-bold font-serif text-amber-900 mt-0.5">{countKota}</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E5DFD1] shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#8D887B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari prestasi, nama siswa, atau lomba..."
            className="w-full pl-9 pr-3.5 py-2 text-sm bg-[#FAF7F2] border border-[#D8D2C5] rounded-xl text-[#2A261F] focus:outline-none focus:ring-2 focus:ring-[#8A5A36]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1 text-xs text-[#6C6659] font-medium">
            <Filter className="w-3.5 h-3.5" /> Kategori:
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs px-2.5 py-1.5 bg-[#FAF7F2] border border-[#D8D2C5] rounded-lg text-[#2A261F]"
          >
            <option value="ALL">Semua Kategori</option>
            <option value="Akademik / Sains">Akademik / Sains</option>
            <option value="Seni & Budaya">Seni & Budaya</option>
            <option value="Olahraga">Olahraga</option>
            <option value="Teknologi & Robotika">Teknologi & Robotika</option>
            <option value="Keagamaan">Keagamaan</option>
            <option value="Kepemimpinan & Organisasi">Kepemimpinan</option>
          </select>

          <div className="flex items-center gap-1 text-xs text-[#6C6659] font-medium ml-2">
            Tingkat:
          </div>
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="text-xs px-2.5 py-1.5 bg-[#FAF7F2] border border-[#D8D2C5] rounded-lg text-[#2A261F]"
          >
            <option value="ALL">Semua Tingkat</option>
            <option value="Internasional">Internasional</option>
            <option value="Nasional">Nasional</option>
            <option value="Provinsi">Provinsi</option>
            <option value="Kota/Kabupaten">Kota/Kabupaten</option>
            <option value="Kecamatan">Kecamatan</option>
            <option value="Sekolah">Sekolah</option>
          </select>
        </div>
      </div>

      {/* Achievement Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAchievements.length === 0 ? (
          <div className="col-span-full bg-white border border-[#E5DFD1] rounded-2xl p-12 text-center">
            <Trophy className="w-12 h-12 text-[#B8B2A5] mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#2A261F]">Belum ada data prestasi yang cocok</h3>
            <p className="text-xs text-[#6C6659] mt-1">Gunakan tombol "Catat Prestasi Baru" untuk menambahkan piagam penghargaan siswa.</p>
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-4 py-2 mt-4 bg-[#8A5A36] text-white text-xs font-semibold rounded-xl"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Catat Prestasi Pertama
            </button>
          </div>
        ) : (
          filteredAchievements.map((ach) => (
            <div
              key={ach.id}
              id={`achievement-card-${ach.id}`}
              className="bg-white border border-[#E5DFD1] rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Level & Category Header */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                        ach.level === 'Internasional'
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : ach.level === 'Nasional'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : ach.level === 'Provinsi'
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      Tingkat {ach.level}
                    </span>

                    <span className="text-[10px] font-semibold bg-[#F2EDE4] text-[#6C6659] px-2 py-0.5 rounded-full">
                      {ach.category}
                    </span>
                  </div>

                  <button
                    onClick={() => onDeleteAchievement(ach.id)}
                    className="text-[#8D887B] hover:text-red-600 p-1 rounded-md hover:bg-red-50 transition-colors"
                    title="Hapus Prestasi"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Rank & Title */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 mt-0.5">
                    <Medal className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-amber-700 uppercase tracking-wide block">
                      {ach.rank} ({ach.year})
                    </span>
                    <h3 className="font-serif font-bold text-base text-[#2A261F] mt-0.5 leading-snug">
                      {ach.title}
                    </h3>
                  </div>
                </div>

                {/* Student Info & Organizer */}
                <div className="mt-3.5 space-y-1.5 text-xs text-[#6C6659] bg-[#FAF7F2] p-3 rounded-xl border border-[#E5DFD1]/60">
                  <div className="flex items-center justify-between">
                    <span>Nama Siswa:</span>
                    <strong className="text-[#2A261F]">{ach.studentName} ({ach.educationLevel} - {ach.gradeClass})</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Penyelenggara:</span>
                    <span className="text-[#4A453A] truncate max-w-[200px]">{ach.organizer}</span>
                  </div>
                  {ach.description && (
                    <p className="text-[11px] text-[#5A554A] pt-1 border-t border-[#E5DFD1]/60">
                      {ach.description}
                    </p>
                  )}
                </div>

                {/* Certificate Thumbnail preview if present */}
                {ach.certificateUrl && (
                  <div className="mt-3">
                    <img
                      src={ach.certificateUrl}
                      alt="Sertifikat Piagam"
                      className="w-full h-32 object-cover rounded-xl border border-[#E5DFD1]"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-[#E5DFD1] flex items-center justify-between text-[11px] text-[#8D887B]">
                <span>Tercatat: {ach.dateRecorded}</span>
                <span className="inline-flex items-center gap-1 font-medium text-[#2D5A43]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Terverifikasi Sekolah
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Achievement Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#FAF7F2] border border-[#E5DFD1] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="bg-[#8A5A36] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                  <Trophy className="w-5 h-5 text-amber-200" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-white">Catat Prestasi & Penghargaan Siswa</h3>
                  <p className="text-xs text-amber-100/80">Input Piagam Lomba, Olimpiade, Seni, dan Olahraga</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/70 hover:text-white hover:bg-white/10 rounded-lg p-1.5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAchievement} className="p-6 overflow-y-auto flex-1 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#4A453A] mb-1">Pilih Siswa yang Berprestasi *</label>
                <select
                  required
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8D2C5] rounded-xl text-[#2A261F] focus:outline-none focus:ring-2 focus:ring-[#8A5A36]"
                >
                  {students.map((std) => (
                    <option key={std.id} value={std.id}>
                      {std.fullName} ({std.educationLevel} - {std.gradeClass}) - NISN: {std.nisn}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A453A] mb-1">Nama Prestasi / Judul Kejuaraan *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Misal: Juara 1 Olimpiade Sains Nasional Informatika"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8D2C5] rounded-xl text-[#2A261F] focus:outline-none focus:ring-2 focus:ring-[#8A5A36]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#4A453A] mb-1">Kategori Bidang *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as AchievementCategory)}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8D2C5] rounded-xl text-[#2A261F] focus:outline-none focus:ring-2 focus:ring-[#8A5A36]"
                  >
                    <option value="Akademik / Sains">Akademik / Sains</option>
                    <option value="Seni & Budaya">Seni & Budaya</option>
                    <option value="Olahraga">Olahraga</option>
                    <option value="Teknologi & Robotika">Teknologi & Robotika</option>
                    <option value="Keagamaan">Keagamaan</option>
                    <option value="Kepemimpinan & Organisasi">Kepemimpinan & Organisasi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A453A] mb-1">Tingkat Kejuaraan *</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as AchievementLevel)}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8D2C5] rounded-xl text-[#2A261F] focus:outline-none focus:ring-2 focus:ring-[#8A5A36]"
                  >
                    <option value="Sekolah">Tingkat Sekolah</option>
                    <option value="Kecamatan">Tingkat Kecamatan</option>
                    <option value="Kota/Kabupaten">Tingkat Kota / Kabupaten</option>
                    <option value="Provinsi">Tingkat Provinsi</option>
                    <option value="Nasional">Tingkat Nasional</option>
                    <option value="Internasional">Tingkat Internasional</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A453A] mb-1">Peringkat / Medali *</label>
                  <input
                    type="text"
                    required
                    value={rank}
                    onChange={(e) => setRank(e.target.value)}
                    placeholder="Juara 1 / Medali Emas / Best Speaker"
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8D2C5] rounded-xl text-[#2A261F] focus:outline-none focus:ring-2 focus:ring-[#8A5A36]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#4A453A] mb-1">Tahun Perolehan</label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8D2C5] rounded-xl text-[#2A261F] focus:outline-none focus:ring-2 focus:ring-[#8A5A36]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A453A] mb-1">Lembaga Penyelenggara</label>
                  <input
                    type="text"
                    value={organizer}
                    onChange={(e) => setOrganizer(e.target.value)}
                    placeholder="Puspresnas Kemendikbudristek / ITB / dsb."
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8D2C5] rounded-xl text-[#2A261F] focus:outline-none focus:ring-2 focus:ring-[#8A5A36]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A453A] mb-1">Deskripsi & Catatan Capaian</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Uraian singkat materi lomba, skor yang diraih, atau kontribusi tim..."
                  className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8D2C5] rounded-xl text-[#2A261F] focus:outline-none focus:ring-2 focus:ring-[#8A5A36]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A453A] mb-1">URL Foto Sertifikat / Piagam (Opsional)</label>
                <input
                  type="url"
                  value={certificateUrl}
                  onChange={(e) => setCertificateUrl(e.target.value)}
                  placeholder="https://... atau biarkan kosong"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8D2C5] rounded-xl text-[#2A261F] focus:outline-none focus:ring-2 focus:ring-[#8A5A36]"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#E5DFD1]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-white border border-[#D8D2C5] hover:bg-[#FAF7F2] rounded-xl text-xs font-semibold text-[#4A453A]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  id="btn-submit-save-achievement"
                  className="px-5 py-2 bg-[#8A5A36] hover:bg-[#724a2c] text-white text-xs font-semibold rounded-xl shadow-sm"
                >
                  Simpan Prestasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
