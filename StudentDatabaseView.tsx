import React, { useState } from 'react';
import { StudentMasterRecord, EducationLevel, UserProfile } from '../types';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  GraduationCap,
  Sparkles,
  Trophy,
  Compass,
  Edit2,
  Trash2,
  Phone,
  Calendar,
  BookOpen,
  Check,
  X,
  FileSpreadsheet,
  Shield,
  Server,
  Lock,
  AlertTriangle,
  Info,
  Building2
} from 'lucide-react';

interface StudentDatabaseViewProps {
  students: StudentMasterRecord[];
  currentUser?: UserProfile;
  onAddStudent: (student: StudentMasterRecord) => void;
  onUpdateStudent: (student: StudentMasterRecord) => void;
  onDeleteStudent: (studentId: string) => void;
  onStartObservationForStudent: (student: StudentMasterRecord) => void;
  onViewAchievementsForStudent: (student: StudentMasterRecord) => void;
  onSelectSMAMajorForStudent: (student: StudentMasterRecord) => void;
  onSelectTalentForStudent?: (student: StudentMasterRecord) => void;
  onOpenMasterControl?: () => void;
}

export const StudentDatabaseView: React.FC<StudentDatabaseViewProps> = ({
  students,
  currentUser,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onStartObservationForStudent,
  onViewAchievementsForStudent,
  onSelectSMAMajorForStudent,
  onSelectTalentForStudent,
  onOpenMasterControl,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isQuotaModalOpen, setIsQuotaModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentMasterRecord | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<StudentMasterRecord | null>(null);

  // Role permissions
  const isLembagaRole = currentUser?.role === 'lembaga' || (currentUser?.studentLimit !== undefined && currentUser?.studentLimit <= 3);
  const isServerRole = ['superadmin', 'kurikulum', 'psikolog', 'peneliti'].includes(currentUser?.role || '');
  const isSuperAdmin = currentUser?.role === 'superadmin';
  const canDelete = currentUser?.canDeleteRecords || isServerRole || isSuperAdmin;

  // Active student list based on role
  const effectiveStudents = isLembagaRole ? students.slice(0, 3) : students;

  // Form states
  const [nisn, setNisn] = useState('');
  const [fullName, setFullName] = useState('');
  const [nickname, setNickname] = useState('');
  const [educationLevel, setEducationLevel] = useState<EducationLevel>('SMA');
  const [gradeClass, setGradeClass] = useState('');
  const [gender, setGender] = useState<'Laki-laki' | 'Perempuan'>('Laki-laki');
  const [birthDate, setBirthDate] = useState('2008-05-15');
  const [ageYears, setAgeYears] = useState(17);
  const [ageMonths, setAgeMonths] = useState(3);
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [address, setAddress] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');

  const filteredStudents = effectiveStudents.filter((std) => {
    const matchesSearch =
      std.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      std.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      std.nisn.includes(searchQuery) ||
      std.gradeClass.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = selectedLevelFilter === 'ALL' || std.educationLevel === selectedLevelFilter;
    return matchesSearch && matchesLevel;
  });

  const countByLevel = {
    ALL: effectiveStudents.length,
    PAUD: effectiveStudents.filter((s) => s.educationLevel === 'PAUD').length,
    SD: effectiveStudents.filter((s) => s.educationLevel === 'SD').length,
    SMP: effectiveStudents.filter((s) => s.educationLevel === 'SMP').length,
    SMA: effectiveStudents.filter((s) => s.educationLevel === 'SMA').length,
  };

  const handleOpenAdd = () => {
    if (isLembagaRole && effectiveStudents.length >= 3) {
      setIsQuotaModalOpen(true);
      return;
    }
    setEditingStudent(null);
    setNisn(`00${Math.floor(10000000 + Math.random() * 90000000)}`);
    setFullName('');
    setNickname('');
    setEducationLevel('SMA');
    setGradeClass('XII IPA 1');
    setGender('Laki-laki');
    setBirthDate('2008-05-15');
    setAgeYears(17);
    setAgeMonths(3);
    setParentName('');
    setParentPhone('');
    setAddress('');
    setSpecialNotes('');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (student: StudentMasterRecord) => {
    setEditingStudent(student);
    setNisn(student.nisn);
    setFullName(student.fullName);
    setNickname(student.nickname);
    setEducationLevel(student.educationLevel);
    setGradeClass(student.gradeClass);
    setGender(student.gender);
    setBirthDate(student.birthDate);
    setAgeYears(student.ageYears);
    setAgeMonths(student.ageMonths);
    setParentName(student.parentName);
    setParentPhone(student.parentPhone);
    setAddress(student.address);
    setSpecialNotes(student.specialNotes || '');
    setIsAddModalOpen(true);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    if (editingStudent) {
      const updated: StudentMasterRecord = {
        ...editingStudent,
        nisn: nisn || editingStudent.nisn,
        fullName,
        nickname: nickname || fullName.split(' ')[0],
        educationLevel,
        gradeClass: gradeClass || (educationLevel === 'SMA' ? 'X SMA' : 'Kelas 1'),
        gender,
        birthDate,
        ageYears: Number(ageYears) || 16,
        ageMonths: Number(ageMonths) || 0,
        parentName,
        parentPhone,
        address,
        specialNotes,
      };
      onUpdateStudent(updated);
    } else {
      const newStd: StudentMasterRecord = {
        id: `std-${Date.now()}`,
        nisn: nisn || `00${Date.now().toString().slice(-8)}`,
        fullName,
        nickname: nickname || fullName.split(' ')[0],
        educationLevel,
        gradeClass: gradeClass || (educationLevel === 'SMA' ? 'X SMA' : 'Kelas 1'),
        gender,
        birthDate,
        ageYears: Number(ageYears) || 16,
        ageMonths: Number(ageMonths) || 0,
        parentName,
        parentPhone,
        address,
        specialNotes,
        createdAt: new Date().toISOString().split('T')[0],
        totalAchievements: 0,
        hasObservation: false,
      };
      onAddStudent(newStd);
    }

    setIsAddModalOpen(false);
  };

  return (
    <div id="student-database-view" className="space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="bg-[#FAF7F2] border border-[#E5DFD1] rounded-2xl p-6 shadow-sm">
        {/* Role & Access Status Strip */}
        <div className="mb-4">
          {isLembagaRole ? (
            <div className="bg-amber-50 border border-amber-300 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2.5 text-amber-900">
                <Building2 className="w-5 h-5 text-amber-700 shrink-0" />
                <div>
                  <span className="font-bold">Mode Akun Lembaga Pendidikan:</span> Batasan kuota aktif (Maksimal 3 Siswa terdaftar).
                </div>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-center">
                <span className="px-2.5 py-1 bg-amber-200/80 text-amber-950 font-extrabold rounded-lg font-mono">
                  Kuota: {effectiveStudents.length} / 3 Siswa
                </span>
              </div>
            </div>
          ) : isServerRole ? (
            <div className="bg-[#1F2937] text-white rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border border-gray-700">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white flex items-center gap-2">
                    <span>{currentUser?.roleLabel || 'Akun Server Spesialis'}</span>
                    <span className="px-2 py-0.2 bg-emerald-700 text-white rounded text-[10px] font-bold">
                      Tinjau Semua Akun
                    </span>
                  </div>
                  <p className="text-gray-300 text-[11px] mt-0.5">
                    Berhak meninjau profil siswa lintas akun lembaga dan menghapus record yang tidak sesuai.
                  </p>
                </div>
              </div>

              {isSuperAdmin && onOpenMasterControl && (
                <button
                  type="button"
                  id="btn-open-master-control-from-db"
                  onClick={onOpenMasterControl}
                  className="px-3.5 py-1.5 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-center shadow-xs shrink-0"
                >
                  <Server className="w-3.5 h-3.5" /> Kontrol Database Utama
                </button>
              )}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#2D5A43]/10 text-[#2D5A43] rounded-full text-xs font-semibold mb-2">
              <Users className="w-3.5 h-3.5" /> Database Pokok Siswa Baru & Master Data Terpadu
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#2A261F]">
              Database Input Siswa & Profil Perkembangan
            </h1>
            <p className="text-sm text-[#6C6659] mt-1 max-w-3xl">
              Pusat kelola data siswa mulai dari jenjang PAUD, SD, SMP, hingga SMA. Terintegrasi langsung dengan modul observasi neuropsikologi, rekam prestasi anak, dan rekomendasi peminatan program studi SMA.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-add-new-student"
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#2D5A43] hover:bg-[#234735] text-white font-medium text-sm rounded-xl shadow-sm transition-all"
            >
              <UserPlus className="w-4 h-4" /> Input Siswa Baru
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-6 border-t border-[#E5DFD1]">
          <div
            onClick={() => setSelectedLevelFilter('ALL')}
            className={`p-3 rounded-xl border cursor-pointer transition-all ${
              selectedLevelFilter === 'ALL' ? 'bg-[#2D5A43] text-white border-[#2D5A43]' : 'bg-white border-[#E5DFD1] text-[#2A261F]'
            }`}
          >
            <div className="text-xs opacity-80 font-medium">Semua Siswa</div>
            <div className="text-xl font-bold font-serif mt-0.5">{countByLevel.ALL}</div>
          </div>

          <div
            onClick={() => setSelectedLevelFilter('PAUD')}
            className={`p-3 rounded-xl border cursor-pointer transition-all ${
              selectedLevelFilter === 'PAUD' ? 'bg-[#2D5A43] text-white border-[#2D5A43]' : 'bg-white border-[#E5DFD1] text-[#2A261F]'
            }`}
          >
            <div className="text-xs opacity-80 font-medium">PAUD / TK</div>
            <div className="text-xl font-bold font-serif mt-0.5">{countByLevel.PAUD}</div>
          </div>

          <div
            onClick={() => setSelectedLevelFilter('SD')}
            className={`p-3 rounded-xl border cursor-pointer transition-all ${
              selectedLevelFilter === 'SD' ? 'bg-[#2D5A43] text-white border-[#2D5A43]' : 'bg-white border-[#E5DFD1] text-[#2A261F]'
            }`}
          >
            <div className="text-xs opacity-80 font-medium">SD / MI</div>
            <div className="text-xl font-bold font-serif mt-0.5">{countByLevel.SD}</div>
          </div>

          <div
            onClick={() => setSelectedLevelFilter('SMP')}
            className={`p-3 rounded-xl border cursor-pointer transition-all ${
              selectedLevelFilter === 'SMP' ? 'bg-[#2D5A43] text-white border-[#2D5A43]' : 'bg-white border-[#E5DFD1] text-[#2A261F]'
            }`}
          >
            <div className="text-xs opacity-80 font-medium">SMP / MTs</div>
            <div className="text-xl font-bold font-serif mt-0.5">{countByLevel.SMP}</div>
          </div>

          <div
            onClick={() => setSelectedLevelFilter('SMA')}
            className={`p-3 rounded-xl border cursor-pointer transition-all ${
              selectedLevelFilter === 'SMA' ? 'bg-[#2D5A43] text-white border-[#2D5A43]' : 'bg-white border-[#E5DFD1] text-[#2A261F]'
            }`}
          >
            <div className="text-xs opacity-80 font-medium">SMA / SMK / MA</div>
            <div className="text-xl font-bold font-serif mt-0.5">{countByLevel.SMA}</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#E5DFD1] shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#8D887B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            id="input-search-student"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama, NISN, atau kelas..."
            className="w-full pl-9 pr-3.5 py-2 text-sm bg-[#FAF7F2] border border-[#D8D2C5] rounded-xl text-[#2A261F] focus:outline-none focus:ring-2 focus:ring-[#2D5A43]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-[#6C6659] font-medium mr-1">
            <Filter className="w-3.5 h-3.5" /> Jenjang:
          </div>
          {(['ALL', 'PAUD', 'SD', 'SMP', 'SMA'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevelFilter(lvl)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                selectedLevelFilter === lvl
                  ? 'bg-[#2D5A43] text-white'
                  : 'bg-[#F2EDE4] text-[#6C6659] hover:bg-[#E5DFD1]'
              }`}
            >
              {lvl === 'ALL' ? 'Semua' : lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Student List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.length === 0 ? (
          <div className="col-span-full bg-white border border-[#E5DFD1] rounded-2xl p-12 text-center">
            <Users className="w-12 h-12 text-[#B8B2A5] mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#2A261F]">Tidak ada data siswa yang cocok</h3>
            <p className="text-xs text-[#6C6659] mt-1">Coba ubah kata kunci pencarian atau tambah siswa baru.</p>
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-4 py-2 mt-4 bg-[#2D5A43] text-white text-xs font-semibold rounded-xl"
            >
              <UserPlus className="w-3.5 h-3.5" /> Tambah Siswa Sekarang
            </button>
          </div>
        ) : (
          filteredStudents.map((std) => {
            const isSMA = std.educationLevel === 'SMA';
            return (
              <div
                key={std.id}
                id={`student-card-${std.id}`}
                className="bg-white border border-[#E5DFD1] rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                          std.educationLevel === 'SMA'
                            ? 'bg-purple-100 text-purple-800 border border-purple-200'
                            : std.educationLevel === 'SMP'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : std.educationLevel === 'SD'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {std.educationLevel} • {std.gradeClass}
                      </span>
                      <span className="text-[11px] text-[#8D887B]">NISN: {std.nisn}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(std)}
                        className="text-[#8D887B] hover:text-[#2D5A43] p-1 rounded-md hover:bg-[#F2EDE4]"
                        title="Edit Data Siswa"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        id={`btn-delete-student-${std.id}`}
                        onClick={() => setStudentToDelete(std)}
                        className="text-[#8D887B] hover:text-red-600 p-1 rounded-md hover:bg-red-50"
                        title={canDelete ? 'Hapus Record Siswa (Otoritas Server)' : 'Hapus Siswa'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Name and Basic Info */}
                  <h3 className="font-serif font-bold text-lg text-[#2A261F] line-clamp-1">{std.fullName}</h3>
                  <div className="text-xs text-[#6C6659] flex items-center gap-3 mt-1">
                    <span>Panggilan: <strong>{std.nickname}</strong></span>
                    <span>•</span>
                    <span>{std.gender} ({std.ageYears} th {std.ageMonths} bln)</span>
                  </div>

                  {/* Details */}
                  <div className="mt-3.5 space-y-1.5 text-xs text-[#6C6659] bg-[#FAF7F2] p-3 rounded-xl border border-[#E5DFD1]/60">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[#8D887B] shrink-0" />
                      <span className="truncate">Ortu: {std.parentName} ({std.parentPhone || 'No HP -'})</span>
                    </div>
                    {std.specialNotes && (
                      <p className="text-[11px] text-[#4A453A] line-clamp-2 italic pt-1 border-t border-[#E5DFD1]/60">
                        "{std.specialNotes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 pt-3 border-t border-[#E5DFD1] space-y-2">
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      id={`btn-observe-${std.id}`}
                      onClick={() => onStartObservationForStudent(std)}
                      className="inline-flex items-center justify-center gap-1 px-2 py-2 bg-[#2D5A43] hover:bg-[#234735] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                      title="Mulai Observasi 5 Langkah Neuropsikologi"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Asesmen
                    </button>

                    <button
                      id={`btn-talents-${std.id}`}
                      onClick={() => onSelectTalentForStudent && onSelectTalentForStudent(std)}
                      className="inline-flex items-center justify-center gap-1 px-2 py-2 bg-emerald-50 hover:bg-emerald-100 text-[#2D5A43] border border-emerald-300 text-xs font-bold rounded-xl transition-colors"
                      title="Pemetaan Bakat & Multiple Intelligences Siswa"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Bakat
                    </button>

                    <button
                      id={`btn-achievements-${std.id}`}
                      onClick={() => onViewAchievementsForStudent(std)}
                      className="inline-flex items-center justify-center gap-1 px-2 py-2 bg-[#FAF7F2] hover:bg-[#F2EDE4] text-[#8A5A36] border border-[#E5DFD1] text-xs font-semibold rounded-xl transition-colors"
                      title="Lihat & Tambah Prestasi Siswa"
                    >
                      <Trophy className="w-3.5 h-3.5 text-amber-600" /> Prestasi
                    </button>
                  </div>

                  {/* Special Button for High School (SMA) Students: Major & Career Guidance */}
                  {isSMA && (
                    <button
                      id={`btn-sma-major-${std.id}`}
                      onClick={() => onSelectSMAMajorForStudent(std)}
                      className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all animate-pulse"
                      title="Rekomendasi Peminatan Program Studi & Penjurusan Kuliah SMA"
                    >
                      <Compass className="w-4 h-4 text-amber-300" /> Peminatan Program Studi SMA (AI)
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#FAF7F2] border border-[#E5DFD1] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="bg-[#2D5A43] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                  <UserPlus className="w-5 h-5 text-emerald-200" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-white">
                    {editingStudent ? 'Edit Data Pokok Siswa' : 'Formulir Input Siswa Baru'}
                  </h3>
                  <p className="text-xs text-emerald-100/80">Pencatatan Data Identitas dan Karakteristik Siswa</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-white/70 hover:text-white hover:bg-white/10 rounded-lg p-1.5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="p-6 overflow-y-auto flex-1 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#4A453A] mb-1">Nomor Induk Siswa Nasional (NISN) *</label>
                  <input
                    type="text"
                    required
                    value={nisn}
                    onChange={(e) => setNisn(e.target.value)}
                    placeholder="Contoh: 0076543210"
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8D2C5] rounded-xl text-[#2A261F] focus:outline-none focus:ring-2 focus:ring-[#2D5A43]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A453A] mb-1">Nama Lengkap Siswa *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nama lengkap sesuai akta"
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8D2C5] rounded-xl text-[#2A261F] focus:outline-none focus:ring-2 focus:ring-[#2D5A43]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#4A453A] mb-1">Nama Panggilan</label>
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="Farhan / Bima"
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8D2C5] rounded-xl text-[#2A261F] focus:outline-none focus:ring-2 focus:ring-[#2D5A43]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A453A] mb-1">Jenjang Pendidikan *</label>
                  <select
                    value={educationLevel}
                    onChange={(e) => setEducationLevel(e.target.value as EducationLevel)}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8D2C5] rounded-xl text-[#2A261F] focus:outline-none focus:ring-2 focus:ring-[#2D5A43]"
                  >
                    <option value="PAUD">PAUD / TK / KB</option>
                    <option value="SD">SD / MI (Sekolah Dasar)</option>
                    <option value="SMP">SMP / MTs</option>
                    <option value="SMA">SMA / SMK / MA</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A453A] mb-1">Kelas / Rombel *</label>
                  <input
                    type="text"
                    required
                    value={gradeClass}
                    onChange={(e) => setGradeClass(e.target.value)}
                    placeholder="Misal: XII IPA 1 / Kelas 2B"
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8D2C5] rounded-xl text-[#2A261F] focus:outline-none focus:ring-2 focus:ring-[#2D5A43]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#4A453A] mb-1">Jenis Kelamin</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'Laki-laki' | 'Perempuan')}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8D2C5] rounded-xl text-[#2A261F] focus:outline-none focus:ring-2 focus:ring-[#2D5A43]"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A453A] mb-1">Usia (Tahun)</label>
                  <input
                    type="number"
                    min={2}
                    max={22}
                    value={ageYears}
                    onChange={(e) => setAgeYears(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8D2C5] rounded-xl text-[#2A261F] focus:outline-none focus:ring-2 focus:ring-[#2D5A43]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A453A] mb-1">Usia (Bulan)</label>
                  <input
                    type="number"
                    min={0}
                    max={11}
                    value={ageMonths}
                    onChange={(e) => setAgeMonths(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8D2C5] rounded-xl text-[#2A261F] focus:outline-none focus:ring-2 focus:ring-[#2D5A43]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#4A453A] mb-1">Nama Orang Tua / Wali</label>
                  <input
                    type="text"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    placeholder="Nama ayah / ibu / wali"
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8D2C5] rounded-xl text-[#2A261F] focus:outline-none focus:ring-2 focus:ring-[#2D5A43]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A453A] mb-1">Nomor WhatsApp / Kontak Ortu</label>
                  <input
                    type="text"
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    placeholder="081234567890"
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8D2C5] rounded-xl text-[#2A261F] focus:outline-none focus:ring-2 focus:ring-[#2D5A43]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A453A] mb-1">Alamat Domisili Siswa</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Kota / Kecamatan / Alamat singkat"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8D2C5] rounded-xl text-[#2A261F] focus:outline-none focus:ring-2 focus:ring-[#2D5A43]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A453A] mb-1">
                  Catatan Khusus / Minat Awal / Karakteristik Belajar
                </label>
                <textarea
                  rows={2}
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder="Catatan kebiasaan belajar, gaya konsentrasi, minat mendalam, atau kebutuhan akomodasi khusus..."
                  className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8D2C5] rounded-xl text-[#2A261F] focus:outline-none focus:ring-2 focus:ring-[#2D5A43]"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#E5DFD1]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-white border border-[#D8D2C5] hover:bg-[#FAF7F2] rounded-xl text-xs font-semibold text-[#4A453A]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  id="btn-submit-save-student"
                  className="px-5 py-2 bg-[#2D5A43] hover:bg-[#234735] text-white text-xs font-semibold rounded-xl shadow-sm"
                >
                  {editingStudent ? 'Simpan Perubahan' : 'Simpan Data Siswa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quota Exceeded Modal for Lembaga */}
      {isQuotaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-amber-300 rounded-2xl shadow-2xl max-w-md w-full p-6 text-center space-y-4">
            <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto border border-amber-200">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#2A261F]">Batas Kuota Lembaga Tercapai</h3>
              <p className="text-xs text-[#6C6659] mt-2 leading-relaxed">
                Sesuai kebijakan akses, akun <strong>Lembaga Pendidikan</strong> dibatasi maksimal <strong>3 anak</strong> untuk pemantauan mandiri.
              </p>
              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-left text-xs text-amber-900 mt-3 space-y-1">
                <p className="font-semibold">💡 Solusi Penambahan Siswa:</p>
                <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-800">
                  <li>Edit atau hapus salah satu dari 3 siswa yang sudah terdaftar.</li>
                  <li>Login menggunakan Akun Server Spesialis (Pengembang Kurikulum, Psikolog, Peneliti).</li>
                  <li>Gunakan Akun Server Utama untuk manajemen database tanpa batas.</li>
                </ul>
              </div>
            </div>
            <button
              onClick={() => setIsQuotaModalOpen(false)}
              className="w-full py-2.5 bg-[#2D5A43] hover:bg-[#234735] text-white text-xs font-bold rounded-xl shadow-xs"
            >
              Saya Mengerti
            </button>
          </div>
        </div>
      )}

      {/* Delete Record Confirmation Modal */}
      {studentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-rose-200 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="w-12 h-12 bg-rose-100 text-rose-700 rounded-2xl flex items-center justify-center mx-auto border border-rose-200">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="font-serif font-bold text-lg text-rose-950">Konfirmasi Hapus Data Siswa</h3>
              <p className="text-xs text-[#6C6659] mt-1">
                Apakah Anda yakin ingin menghapus data siswa <strong>{studentToDelete.fullName}</strong> (NISN: {studentToDelete.nisn})?
              </p>
              <div className="bg-rose-50 text-rose-800 text-[11px] p-2.5 rounded-xl border border-rose-200 mt-3 text-left">
                ⚠️ Tindakan ini akan menghapus riwayat asesmen, pemetaan bakat, dan catatan prestasi siswa ini dari database aktif.
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStudentToDelete(null)}
                className="px-4 py-2 bg-[#FAF7F2] hover:bg-[#E5DFD1] text-[#4A453A] text-xs font-semibold rounded-xl border border-[#D8D2C5]"
              >
                Batal
              </button>
              <button
                type="button"
                id="btn-confirm-delete-student-modal"
                onClick={() => {
                  onDeleteStudent(studentToDelete.id);
                  setStudentToDelete(null);
                }}
                className="px-5 py-2 bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" /> Ya, Hapus Siswa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
