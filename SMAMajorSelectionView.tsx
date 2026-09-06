import React, { useState } from 'react';
import {
  StudentMasterRecord,
  StudentAchievement,
  SMAMajorRecommendation,
  ComprehensiveAnalysisResult
} from '../types';
import { INITIAL_SMA_RECOMMENDATIONS } from '../data/mockStudentDatabase';
import {
  Compass,
  Sparkles,
  GraduationCap,
  BookOpen,
  CheckCircle2,
  Award,
  TrendingUp,
  Building2,
  Briefcase,
  Layers,
  ArrowRight,
  Printer,
  ChevronRight,
  Brain,
  Lightbulb,
  Check,
  Target
} from 'lucide-react';

interface SMAMajorSelectionViewProps {
  students: StudentMasterRecord[];
  achievements: StudentAchievement[];
  selectedStudent: StudentMasterRecord | null;
  onSelectStudent: (student: StudentMasterRecord) => void;
  neuroProfile?: ComprehensiveAnalysisResult | null;
}

const FIELD_CLUSTERS = [
  {
    id: 'it_ai',
    title: 'Teknologi Informasi, AI & Data Science',
    icon: '💡',
    examples: 'Informatika, Kecerdasan Buatan, Cyber Security, Sains Data, Software Engineering',
  },
  {
    id: 'engineering',
    title: 'Teknik & Rekayasa Industri',
    icon: '⚙️',
    examples: 'Teknik Elektro, Mesin, Sipil, Industri, Mekatronika, Robotika',
  },
  {
    id: 'medicine',
    title: 'Kedokteran & Ilmu Kesehatan',
    icon: '🩺',
    examples: 'Kedokteran Umum, Gigi, Farmasi, Gizi Klinis, Fisioterapi, Keperawatan',
  },
  {
    id: 'pure_science',
    title: 'Sains Murni & Matematika Terapan',
    icon: '🔬',
    examples: 'Matematika, Aktuaria, Statistika, Fisika, Bioteknologi, Astronomi',
  },
  {
    id: 'business',
    title: 'Bisnis, Manajemen & Ekonomi Digital',
    icon: '📈',
    examples: 'Manajemen Bisnis, Akuntansi, Bisnis Digital, Ilmu Ekonomi, Kewirausahaan',
  },
  {
    id: 'law_social',
    title: 'Hukum, Hubungan Internasional & Kebijakan',
    icon: '⚖️',
    examples: 'Ilmu Hukum, Hubungan Internasional, Ilmu Politik, Kebijakan Publik',
  },
  {
    id: 'design_art',
    title: 'Seni, Desain Komunikasi & Arsitektur',
    icon: '🎨',
    examples: 'Arsitektur, DKV, Desain Produk, Film & Animasi, Game Design',
  },
  {
    id: 'humanities',
    title: 'Psikologi, Komunikasi & Bahasa',
    icon: '📚',
    examples: 'Psikologi, Ilmu Komunikasi, Sastra Inggris, Jurnalistik, Hubungan Masyarakat',
  },
];

const SMA_SUBJECTS = [
  'Matematika Tingkat Lanjut',
  'Informatika / Pemrograman',
  'Fisika',
  'Kimia',
  'Biologi',
  'Bahasa Inggris Akademik',
  'Ekonomi & Akuntansi',
  'Sosiologi & Antropologi',
  'Geografi',
  'Seni Rupa & Desain',
  'Pendidikan Kewarganegaraan',
];

export const SMAMajorSelectionView: React.FC<SMAMajorSelectionViewProps> = ({
  students,
  achievements,
  selectedStudent,
  onSelectStudent,
  neuroProfile,
}) => {
  const smaStudents = students.filter((s) => s.educationLevel === 'SMA');

  const currentStudent =
    selectedStudent && selectedStudent.educationLevel === 'SMA'
      ? selectedStudent
      : smaStudents.length > 0
      ? smaStudents[0]
      : null;

  // Selected parameters
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Teknologi Informasi, AI & Data Science',
    'Teknik & Rekayasa Industri',
  ]);
  const [favoriteSubjects, setFavoriteSubjects] = useState<string[]>([
    'Matematika Tingkat Lanjut',
    'Informatika / Pemrograman',
  ]);
  const [hobbiesText, setHobbiesText] = useState(
    'Pemrograman koding, memecahkan teka-teki logika algoritma, dan membuat proyek otomatisasi.'
  );
  const [careerAspirations, setCareerAspirations] = useState(
    'AI Engineer / Chief Technology Officer di bidang rekayasa teknologi'
  );

  const [recommendationResult, setRecommendationResult] = useState<SMAMajorRecommendation | null>(
    currentStudent && INITIAL_SMA_RECOMMENDATIONS[currentStudent.id]
      ? INITIAL_SMA_RECOMMENDATIONS[currentStudent.id]
      : null
  );

  const [isLoading, setIsLoading] = useState(false);

  const studentAchievements = currentStudent
    ? achievements.filter((a) => a.studentId === currentStudent.id)
    : [];

  const toggleInterest = (title: string) => {
    if (selectedInterests.includes(title)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== title));
    } else {
      setSelectedInterests([...selectedInterests, title]);
    }
  };

  const toggleSubject = (subject: string) => {
    if (favoriteSubjects.includes(subject)) {
      setFavoriteSubjects(favoriteSubjects.filter((s) => s !== subject));
    } else {
      setFavoriteSubjects([...favoriteSubjects, subject]);
    }
  };

  const handleGenerateRecommendation = async () => {
    if (!currentStudent) return;
    setIsLoading(true);

    try {
      const response = await fetch('/api/recommend-sma-majors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student: currentStudent,
          selectedInterests,
          favoriteSubjects,
          hobbiesAndPassion: hobbiesText.split(',').map((s) => s.trim()),
          careerAspirations,
          achievements: studentAchievements,
          neuroProfile,
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal menganalisis peminatan prodi');
      }

      const data = await response.json();
      setRecommendationResult(data);
    } catch (err) {
      console.warn('API error, using client fallback recommendation:', err);
      // Fallback recommendation
      if (INITIAL_SMA_RECOMMENDATIONS[currentStudent.id]) {
        setRecommendationResult(INITIAL_SMA_RECOMMENDATIONS[currentStudent.id]);
      } else {
        setRecommendationResult({
          id: `rec-sma-${Date.now()}`,
          studentId: currentStudent.id,
          studentName: currentStudent.fullName,
          gradeClass: currentStudent.gradeClass,
          primaryInterests: selectedInterests,
          favoriteSubjects,
          hobbiesAndPassion: [hobbiesText],
          careerAspirations,
          learningStyleSynergy:
            'Gaya kognitif analitis sekuensial dengan rekam jejak prestasi yang kuat memberikan daya saing tinggi pada program studi sains terapan dan rekayasa teknologi.',
          topRecommendedMajors: [
            {
              majorName: 'Teknik Informatika / Ilmu Komputer (Computer Science)',
              faculty: 'Fakultas Ilmu Komputer & Rekayasa Sistem',
              matchScore: 96,
              cognitiveAlignmentReason:
                'Kemampuan penalaran logis, kecakapan matematika, dan minat pada otomasi sangat selaras dengan kurikulum kecerdasan buatan dan komputasi awan.',
              potentialCareers: ['AI & ML Engineer', 'Software Architect', 'Cybersecurity Specialist', 'Tech Founder'],
              recommendedSubjectsToStrengthen: ['Matematika Lanjut (Kalkulus & Aljabar)', 'Informatika Pemrograman Dasar'],
              topUniversitiesInIndonesia: ['Institut Teknologi Bandung (ITB)', 'Universitas Indonesia (UI)', 'Institut Teknologi Sepuluh Nopember (ITS)', 'Universitas Gadjah Mada (UGM)'],
            },
            {
              majorName: 'Sains Data & Matematika Komputasi (Data Science)',
              faculty: 'Fakultas MIPA / Teknologi Terapan',
              matchScore: 91,
              cognitiveAlignmentReason:
                'Kombinasi antara penalaran data kuantitatif dan interpretasi visual pola sistematis.',
              potentialCareers: ['Chief Data Officer', 'Quantitative Analyst', 'Big Data Architect'],
              recommendedSubjectsToStrengthen: ['Statistika Terapan', 'Bahasa Inggris Ilmiah'],
              topUniversitiesInIndonesia: ['Universitas Airlangga (UNAIR)', 'IPB University', 'UI', 'UGM'],
            },
          ],
          actionPlanForSMA: [
            'Menyiapkan portofolio proyek terstruktur untuk jalur prestasi/mandiri perguruan tinggi impian.',
            'Memperdalam latihan pemecahan soal Penalaran Matematika dan Literasi SNBT/UTBK.',
            'Mengikuti program pembinaan olimpiade sains atau hackathon pelajar tingkat nasional.',
          ],
          generatedAt: new Date().toISOString(),
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (smaStudents.length === 0) {
    return (
      <div className="bg-white border border-[#E5DFD1] rounded-2xl p-12 text-center">
        <GraduationCap className="w-12 h-12 text-[#B8B2A5] mx-auto mb-3" />
        <h3 className="text-lg font-bold text-[#2A261F]">Belum Ada Data Siswa Jenjang SMA</h3>
        <p className="text-xs text-[#6C6659] mt-1 max-w-md mx-auto">
          Silakan tambahkan data siswa jenjang SMA (Kelas X, XI, atau XII) di menu <strong>Database Siswa Baru</strong> untuk menggunakan modul peminatan program studi ini.
        </p>
      </div>
    );
  }

  return (
    <div id="sma-major-selection-view" className="space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-[#2D5A43] text-white rounded-2xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 text-purple-200 rounded-full text-xs font-semibold mb-2 border border-white/20">
              <Compass className="w-3.5 h-3.5 text-amber-300" /> Bimbingan Karir & Peminatan Program Studi Kuliah (SMA / SMK)
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Pilihan Peminatan Program Studi & Karir Masa Depan
            </h1>
            <p className="text-sm text-purple-100/90 mt-1 max-w-3xl">
              Sistem rekomendasi berbasis AI yang memadukan <strong>Profil Gaya Belajar/Neuropsikologi</strong>, <strong>Rekam Jejak Prestasi</strong>, dan <strong>Minat Intrinsik Siswa</strong> untuk memilih jurusan kuliah dan kampus terbaik di Indonesia.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-3.5 rounded-xl border border-white/20 shrink-0 flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-amber-300" />
            <div>
              <div className="text-[11px] text-purple-200 font-medium">Siswa Terpilih:</div>
              <div className="font-bold text-sm text-white">{currentStudent?.fullName}</div>
              <div className="text-[11px] text-purple-200">{currentStudent?.gradeClass} • NISN: {currentStudent?.nisn}</div>
            </div>
          </div>
        </div>

        {/* Student Selector Row */}
        <div className="mt-5 pt-4 border-t border-white/15 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-purple-200 mr-1">Ganti Siswa SMA:</span>
          {smaStudents.map((s) => {
            const isSelected = currentStudent?.id === s.id;
            return (
              <button
                key={s.id}
                id={`btn-select-sma-student-${s.id}`}
                onClick={() => {
                  onSelectStudent(s);
                  if (INITIAL_SMA_RECOMMENDATIONS[s.id]) {
                    setRecommendationResult(INITIAL_SMA_RECOMMENDATIONS[s.id]);
                  } else {
                    setRecommendationResult(null);
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-amber-400 text-purple-950 font-bold shadow-xs'
                    : 'bg-white/15 hover:bg-white/25 text-white'
                }`}
              >
                {s.fullName} ({s.gradeClass})
              </button>
            );
          })}
        </div>
      </div>

      {/* Input Selection Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Interests & Subjects */}
        <div className="lg:col-span-2 space-y-5">
          {/* Rumpun Bidang Studi Interaktif */}
          <div className="bg-white border border-[#E5DFD1] rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-serif font-bold text-base text-[#2A261F] flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-700" /> 1. Pilih Rumpun Minat Bidang Ilmu (Bisa Lebih Dari Satu)
              </h3>
              <span className="text-xs text-[#8D887B]">Terpilih: {selectedInterests.length}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {FIELD_CLUSTERS.map((cluster) => {
                const isChecked = selectedInterests.includes(cluster.title);
                return (
                  <div
                    key={cluster.id}
                    onClick={() => toggleInterest(cluster.title)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                      isChecked
                        ? 'bg-purple-50/80 border-purple-600 shadow-xs'
                        : 'bg-[#FAF7F2] border-[#E5DFD1] hover:border-purple-300'
                    }`}
                  >
                    <span className="text-xl mt-0.5">{cluster.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-[#2A261F]">{cluster.title}</h4>
                        <div
                          className={`w-4 h-4 rounded-md flex items-center justify-center border ${
                            isChecked ? 'bg-purple-700 border-purple-700 text-white' : 'border-[#D8D2C5]'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                      </div>
                      <p className="text-[11px] text-[#6C6659] mt-0.5 line-clamp-1">{cluster.examples}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mata Pelajaran Unggulan & Nilai Tertinggi */}
          <div className="bg-white border border-[#E5DFD1] rounded-2xl p-5 shadow-xs">
            <h3 className="font-serif font-bold text-base text-[#2A261F] flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-emerald-700" /> 2. Mata Pelajaran SMA Favorit / Unggulan
            </h3>

            <div className="flex flex-wrap gap-2">
              {SMA_SUBJECTS.map((subj) => {
                const isSelected = favoriteSubjects.includes(subj);
                return (
                  <button
                    key={subj}
                    type="button"
                    onClick={() => toggleSubject(subj)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                      isSelected
                        ? 'bg-[#2D5A43] text-white border-[#2D5A43]'
                        : 'bg-[#FAF7F2] text-[#4A453A] border-[#D8D2C5] hover:bg-[#F2EDE4]'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {subj}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hobi & Aspirasi Karir */}
          <div className="bg-white border border-[#E5DFD1] rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-base text-[#2A261F] flex items-center gap-2">
              <Target className="w-4 h-4 text-amber-700" /> 3. Hobi, Ketertarikan Khusus & Aspirasi Cita-Cita
            </h3>

            <div>
              <label className="block text-xs font-semibold text-[#4A453A] mb-1">
                Hobi & Ketertarikan Mendalam (Aktivitas saat waktu luang):
              </label>
              <input
                type="text"
                value={hobbiesText}
                onChange={(e) => setHobbiesText(e.target.value)}
                placeholder="Contoh: Koding, merakit robot, fotografi, membaca buku diplomasi..."
                className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#D8D2C5] rounded-xl text-[#2A261F] focus:outline-none focus:ring-2 focus:ring-purple-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A453A] mb-1">
                Aspirasi Karir / Profesi Impian Siswa:
              </label>
              <input
                type="text"
                value={careerAspirations}
                onChange={(e) => setCareerAspirations(e.target.value)}
                placeholder="Contoh: Data Scientist, Arsitek Berkelanjutan, Diplomat, Dokter Spesialis..."
                className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#D8D2C5] rounded-xl text-[#2A261F] focus:outline-none focus:ring-2 focus:ring-purple-700"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Integrated Student Data & Run AI */}
        <div className="space-y-5">
          {/* Integrated Profile & Achievements */}
          <div className="bg-[#FAF7F2] border border-[#E5DFD1] rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-base text-[#2A261F] flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-700" /> Rekam Jejak Terpadu Siswa
            </h3>

            {/* Neuro Profile Summary if available */}
            <div className="p-3 bg-white rounded-xl border border-[#E5DFD1] text-xs space-y-1">
              <div className="text-[#8D887B] font-medium">Gaya Kognitif / Belajar:</div>
              <div className="font-bold text-[#2A261F]">
                {neuroProfile?.neurodevelopmentalStyle?.archetypeTitle ||
                  currentStudent?.specialNotes ||
                  'Pemikir Analitis-Sekuensial dengan Daya Fokus Mendalam'}
              </div>
            </div>

            {/* Achievements recorded */}
            <div className="p-3 bg-white rounded-xl border border-[#E5DFD1] text-xs space-y-2">
              <div className="flex items-center justify-between text-[#8D887B] font-medium">
                <span>Prestasi Resmi Terdaftar:</span>
                <span className="font-bold text-amber-700">{studentAchievements.length} Piagam</span>
              </div>
              {studentAchievements.length > 0 ? (
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {studentAchievements.map((ach) => (
                    <div key={ach.id} className="p-2 bg-[#FAF7F2] rounded-lg border border-[#E5DFD1]/60 text-[11px]">
                      <div className="font-bold text-[#2A261F] line-clamp-1">{ach.title}</div>
                      <div className="text-amber-800 font-medium">{ach.rank} • Tingkat {ach.level}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-[#8D887B] italic">Belum ada prestasi resmi yang tercatat di database.</p>
              )}
            </div>

            {/* Generate Action Button */}
            <button
              id="btn-generate-sma-recommendation"
              onClick={handleGenerateRecommendation}
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-800 to-indigo-800 hover:from-purple-900 hover:to-indigo-900 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                  <span>Menganalisis Kecocokan Jurusan...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Analisis AI Rekomendasi Program Studi</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Results View: Recommended Majors */}
      {recommendationResult && (
        <div id="sma-recommendation-report" className="space-y-6 pt-4 border-t border-[#E5DFD1] animate-fadeIn">
          {/* Synergy Banner */}
          <div className="bg-[#FAF7F2] border border-purple-300/80 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5DFD1]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-purple-100 border border-purple-300 flex items-center justify-center text-purple-900 shrink-0">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                    Hasil Rekomendasi Penjurusan Kuliah
                  </span>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#2A261F] mt-1">
                    Profil Rekomendasi Program Studi: {recommendationResult.studentName}
                  </h2>
                  <div className="text-xs text-[#6C6659]">
                    Kelas: {recommendationResult.gradeClass} • Dianalisis: {new Date(recommendationResult.generatedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </div>
              </div>

              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#D8D2C5] hover:bg-[#F2EDE4] text-[#4A453A] font-semibold text-xs rounded-xl shadow-xs transition-colors shrink-0"
              >
                <Printer className="w-4 h-4 text-purple-800" /> Cetak Lembar Rekomendasi (PDF)
              </button>
            </div>

            {/* Learning Style Synergy */}
            <div className="mt-4 bg-white p-4 rounded-xl border border-purple-200/80">
              <h4 className="text-xs font-bold text-purple-900 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                <Brain className="w-4 h-4 text-purple-700" /> Sinergi Gaya Kognitif, Prestasi & Peminatan Karir:
              </h4>
              <p className="text-xs sm:text-sm text-[#4A453A] leading-relaxed">
                {recommendationResult.learningStyleSynergy}
              </p>
            </div>
          </div>

          {/* Major Cards Grid */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#2A261F] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-700" /> Top Pilihan Program Studi Perguruan Tinggi Terbaik
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {recommendationResult.topRecommendedMajors.map((major, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-[#E5DFD1] rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Ranking & Match Score */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-purple-700 text-white">
                        Pilihan #{idx + 1}
                      </span>
                      <div className="text-right">
                        <span className="text-xs font-bold text-emerald-700">Skor Kecocokan</span>
                        <div className="text-lg font-bold font-serif text-[#2A261F]">{major.matchScore}%</div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-[#E5DFD1] h-1.5 rounded-full mb-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-purple-600 to-emerald-600 h-full rounded-full"
                        style={{ width: `${major.matchScore}%` }}
                      ></div>
                    </div>

                    {/* Major Name & Faculty */}
                    <h4 className="font-serif font-bold text-base text-[#2A261F] leading-snug">{major.majorName}</h4>
                    <div className="text-xs text-purple-800 font-medium mt-0.5">{major.faculty}</div>

                    {/* Cognitive Alignment Reason */}
                    <div className="mt-3 p-3 bg-[#FAF7F2] rounded-xl border border-[#E5DFD1]/80 text-xs text-[#5A554A] leading-relaxed">
                      <strong>Alasan Keselarasan Potensi:</strong> {major.cognitiveAlignmentReason}
                    </div>

                    {/* Potential Careers */}
                    <div className="mt-3 space-y-1">
                      <span className="text-[11px] font-bold text-[#6C6659] uppercase tracking-wide flex items-center gap-1">
                        <Briefcase className="w-3 h-3 text-purple-700" /> Prospek Karir Masa Depan:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {major.potentialCareers.map((c, cIdx) => (
                          <span
                            key={cIdx}
                            className="text-[11px] font-medium bg-purple-50 text-purple-900 border border-purple-200/80 px-2 py-0.5 rounded-md"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Recommended Subjects to Strengthen */}
                    <div className="mt-3 space-y-1">
                      <span className="text-[11px] font-bold text-[#6C6659] uppercase tracking-wide flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-emerald-700" /> Mapel SMA yang Perlu Diperkuat:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {major.recommendedSubjectsToStrengthen.map((s, sIdx) => (
                          <span
                            key={sIdx}
                            className="text-[11px] font-medium bg-emerald-50 text-emerald-900 border border-emerald-200/80 px-2 py-0.5 rounded-md"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Top Universities */}
                  <div className="mt-4 pt-3 border-t border-[#E5DFD1]">
                    <span className="text-[11px] font-bold text-[#8D887B] uppercase tracking-wide flex items-center gap-1 mb-1">
                      <Building2 className="w-3 h-3 text-amber-700" /> Rekomendasi Kampus Terkemuka:
                    </span>
                    <ul className="text-xs text-[#4A453A] space-y-0.5">
                      {major.topUniversitiesInIndonesia.map((uni, uIdx) => (
                        <li key={uIdx} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-600 shrink-0"></span>
                          <span className="truncate">{uni}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Plan for SMA Preparation */}
          <div className="bg-white border border-[#E5DFD1] rounded-2xl p-6 shadow-xs">
            <h3 className="font-serif font-bold text-base text-[#2A261F] flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-amber-600" /> Rencana Aksi Persiapan SMA Menuju Perguruan Tinggi Impian
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendationResult.actionPlanForSMA.map((step, sIdx) => (
                <div key={sIdx} className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E5DFD1] flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-purple-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {sIdx + 1}
                  </div>
                  <p className="text-xs sm:text-sm text-[#4A453A] leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
