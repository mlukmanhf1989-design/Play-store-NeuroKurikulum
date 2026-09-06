import React, { useState, useEffect } from 'react';
import {
  StudentMasterRecord,
  StudentAchievement,
  TalentAnalysisResult,
  TalentIntelligenceKey,
  UserProfile,
} from '../types';
import {
  TALENT_DIMENSIONS,
  TALENT_QUESTIONNAIRE_ITEMS,
  INITIAL_TALENT_ANALYSES,
  generateFallbackTalentAnalysis,
} from '../data/mockTalentData';
import {
  Sparkles,
  Brain,
  Calculator,
  BookOpen,
  Palette,
  Activity,
  Music,
  Users,
  Compass,
  Leaf,
  Trophy,
  Printer,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  Award,
  ChevronRight,
  TrendingUp,
  School,
  Home,
  Briefcase,
  Search,
  Filter,
  Layers,
  Info,
  ShieldCheck,
  Star,
  Flame,
  ArrowRight,
  Target,
  FileText,
} from 'lucide-react';

interface TalentMappingViewProps {
  students: StudentMasterRecord[];
  achievements: StudentAchievement[];
  selectedStudent: StudentMasterRecord | null;
  onSelectStudent: (student: StudentMasterRecord) => void;
  currentUser?: UserProfile;
}

type SubTabMode = 'assessment' | 'results' | 'encyclopedia' | 'print';

export const TalentMappingView: React.FC<TalentMappingViewProps> = ({
  students,
  achievements,
  selectedStudent,
  onSelectStudent,
  currentUser,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<SubTabMode>('assessment');
  const [studentFilter, setStudentFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Current active student
  const activeStudent = selectedStudent || students[0] || null;

  // Assessments repository
  const [savedAnalyses, setSavedAnalyses] = useState<Record<string, TalentAnalysisResult>>(
    INITIAL_TALENT_ANALYSES
  );

  // Questionnaire responses state: record of questionId -> score (1 to 5)
  const [questionScores, setQuestionScores] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    TALENT_QUESTIONNAIRE_ITEMS.forEach((q) => {
      initial[q.id] = 4; // default initial score 4/5
    });
    return initial;
  });

  // Dimension direct scores 0-100
  const [dimensionScores, setDimensionScores] = useState<Record<TalentIntelligenceKey, number>>({
    logical_math: 85,
    linguistic: 75,
    spatial_visual: 80,
    bodily_kinesthetic: 65,
    musical: 60,
    interpersonal: 75,
    intrapersonal: 80,
    naturalist: 65,
    existential: 70,
  });

  const [customObservationNotes, setCustomObservationNotes] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [selectedEncyclopediaKey, setSelectedEncyclopediaKey] = useState<TalentIntelligenceKey>('logical_math');

  // Load existing analysis if available when activeStudent changes
  useEffect(() => {
    if (activeStudent && savedAnalyses[activeStudent.id]) {
      const existing = savedAnalyses[activeStudent.id];
      setDimensionScores(existing.dimensionScores);
      setActiveSubTab('results');
    } else if (activeStudent) {
      // Preset based on student level / notes
      if (activeStudent.educationLevel === 'SMA') {
        setDimensionScores({
          logical_math: 92,
          spatial_visual: 86,
          intrapersonal: 80,
          linguistic: 75,
          interpersonal: 70,
          bodily_kinesthetic: 60,
          naturalist: 55,
          musical: 50,
          existential: 75,
        });
      } else if (activeStudent.educationLevel === 'PAUD') {
        setDimensionScores({
          bodily_kinesthetic: 90,
          musical: 85,
          spatial_visual: 82,
          interpersonal: 78,
          linguistic: 70,
          naturalist: 75,
          logical_math: 60,
          intrapersonal: 65,
          existential: 50,
        });
      } else {
        setDimensionScores({
          spatial_visual: 88,
          naturalist: 84,
          linguistic: 80,
          logical_math: 76,
          interpersonal: 72,
          bodily_kinesthetic: 70,
          musical: 65,
          intrapersonal: 68,
          existential: 60,
        });
      }
      setActiveSubTab('assessment');
    }
  }, [activeStudent?.id]);

  // Update dimension scores whenever questionnaire items change
  const handleQuestionScoreChange = (qId: string, score: number) => {
    const updated = { ...questionScores, [qId]: score };
    setQuestionScores(updated);

    // Recalculate dimension scores
    const newDimScores = { ...dimensionScores };
    TALENT_DIMENSIONS.forEach((dim) => {
      const relatedQuestions = TALENT_QUESTIONNAIRE_ITEMS.filter((q) => q.dimensionKey === dim.key);
      if (relatedQuestions.length > 0) {
        const sum = relatedQuestions.reduce((acc, curr) => acc + (updated[curr.id] || 3), 0);
        const avg = sum / relatedQuestions.length; // 1 to 5
        const percentage = Math.round((avg / 5) * 100);
        newDimScores[dim.key] = percentage;
      }
    });
    setDimensionScores(newDimScores);
  };

  // Quick preset loader based on student's specialization
  const handleLoadAutoPreset = () => {
    if (!activeStudent) return;
    const isSci = activeStudent.specialNotes?.toLowerCase().includes('logika') || activeStudent.specialNotes?.toLowerCase().includes('robotika');
    const isLang = activeStudent.specialNotes?.toLowerCase().includes('komunikasi') || activeStudent.specialNotes?.toLowerCase().includes('debat');
    const isKin = activeStudent.specialNotes?.toLowerCase().includes('motorik') || activeStudent.specialNotes?.toLowerCase().includes('gerak');

    let preset: Record<TalentIntelligenceKey, number>;

    if (isSci) {
      preset = {
        logical_math: 95,
        spatial_visual: 88,
        intrapersonal: 84,
        linguistic: 72,
        interpersonal: 68,
        bodily_kinesthetic: 62,
        naturalist: 60,
        musical: 55,
        existential: 75,
      };
    } else if (isLang) {
      preset = {
        linguistic: 96,
        interpersonal: 92,
        existential: 88,
        intrapersonal: 82,
        logical_math: 75,
        spatial_visual: 68,
        musical: 65,
        bodily_kinesthetic: 58,
        naturalist: 60,
      };
    } else if (isKin) {
      preset = {
        bodily_kinesthetic: 94,
        spatial_visual: 85,
        musical: 80,
        interpersonal: 82,
        naturalist: 75,
        logical_math: 65,
        linguistic: 68,
        intrapersonal: 70,
        existential: 55,
      };
    } else {
      preset = {
        spatial_visual: 90,
        naturalist: 86,
        linguistic: 82,
        logical_math: 78,
        interpersonal: 74,
        intrapersonal: 72,
        bodily_kinesthetic: 68,
        musical: 62,
        existential: 65,
      };
    }

    setDimensionScores(preset);
  };

  // Run AI Analysis via backend API
  const handleRunAIAnalysis = async () => {
    if (!activeStudent) return;
    setIsAnalyzing(true);

    const studentAchievements = achievements.filter((a) => a.studentId === activeStudent.id);

    try {
      const response = await fetch('/api/analyze-talents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student: activeStudent,
          dimensionScores,
          customNotes: customObservationNotes,
          achievements: studentAchievements,
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal menghubungi server analisis bakat.');
      }

      const result: TalentAnalysisResult = await response.json();
      setSavedAnalyses((prev) => ({ ...prev, [activeStudent.id]: result }));
      setActiveSubTab('results');
    } catch (err) {
      console.warn('Fallback talent analysis triggered due to:', err);
      const fallbackResult = generateFallbackTalentAnalysis(
        activeStudent,
        dimensionScores,
        customObservationNotes
      );
      setSavedAnalyses((prev) => ({ ...prev, [activeStudent.id]: fallbackResult }));
      setActiveSubTab('results');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Filter students list
  const filteredStudents = students.filter((s) => {
    const matchesFilter = studentFilter === 'ALL' || s.educationLevel === studentFilter;
    const matchesSearch =
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nisn.includes(searchQuery) ||
      s.gradeClass.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const currentAnalysis = activeStudent ? savedAnalyses[activeStudent.id] : null;

  // Icon selector helper
  const getDimensionIcon = (iconName: string) => {
    switch (iconName) {
      case 'Calculator':
        return Calculator;
      case 'BookOpen':
        return BookOpen;
      case 'Palette':
        return Palette;
      case 'Activity':
        return Activity;
      case 'Music':
        return Music;
      case 'Users':
        return Users;
      case 'Compass':
        return Compass;
      case 'Leaf':
        return Leaf;
      case 'Sparkles':
      default:
        return Sparkles;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#2D5A43] via-[#356B50] to-[#1E3F2E] rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 transform skew-x-12 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-emerald-200 text-xs font-semibold border border-white/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Modul Pemetaan Bakat & Multiple Intelligences (Howard Gardner)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              Peta Bakat, Potensi Alami & Gaya Belajar Siswa
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Asesmen kekuatan kognitif 8-9 dimensi kecerdasan majemuk, rekomendasi ekstrakurikuler, ajang kompetisi, serta strategi stimulasi guru dan orang tua berbasis kekuatan (strength-based pedagogy).
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-3 bg-black/20 backdrop-blur-xs p-3.5 rounded-2xl border border-white/15">
            <div className="text-center px-2">
              <div className="text-xl font-bold text-emerald-300">{students.length}</div>
              <div className="text-[10px] text-white/80">Total Siswa</div>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div className="text-center px-2">
              <div className="text-xl font-bold text-amber-300">
                {Object.keys(savedAnalyses).length}
              </div>
              <div className="text-[10px] text-white/80">Bakat Terpetakan</div>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div className="text-center px-2">
              <div className="text-xl font-bold text-purple-300">8+1</div>
              <div className="text-[10px] text-white/80">Dimensi Kecerdasan</div>
            </div>
          </div>
        </div>
      </div>

      {/* Student Selector Card */}
      <div className="bg-white rounded-2xl border border-[#E5DFD1] p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#2D5A43]" />
            <h2 className="text-sm sm:text-base font-serif font-bold text-[#2A261F]">
              Pilih Siswa untuk Pemetaan Bakat:
            </h2>
          </div>

          {/* Level Filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {(['ALL', 'PAUD', 'SD', 'SMP', 'SMA'] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setStudentFilter(lvl)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  studentFilter === lvl
                    ? 'bg-[#2D5A43] text-white shadow-2xs'
                    : 'bg-[#F2EDE4] text-[#5A554A] hover:bg-[#E8E2D5]'
                }`}
              >
                {lvl === 'ALL' ? 'Semua Jenjang' : lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Student Cards Carousel / List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {filteredStudents.slice(0, 4).map((std) => {
            const isSelected = activeStudent?.id === std.id;
            const hasSaved = Boolean(savedAnalyses[std.id]);

            return (
              <button
                key={std.id}
                type="button"
                onClick={() => onSelectStudent(std)}
                className={`text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#EBF3EE] border-[#2D5A43] ring-2 ring-[#2D5A43]/20 shadow-xs'
                    : 'bg-[#FAF7F2] hover:bg-white border-[#E5DFD1] hover:border-[#D4CDBC]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span
                      className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        std.educationLevel === 'SMA'
                          ? 'bg-purple-100 text-purple-800'
                          : std.educationLevel === 'SMP'
                          ? 'bg-blue-100 text-blue-800'
                          : std.educationLevel === 'SD'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {std.educationLevel} • {std.gradeClass}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-[#2A261F] mt-1 line-clamp-1">
                      {std.fullName}
                    </h3>
                    <p className="text-[11px] text-[#8D887B]">
                      Usia {std.ageYears} th {std.ageMonths} bln
                    </p>
                  </div>
                  {hasSaved ? (
                    <span
                      className="p-1 rounded-full bg-emerald-100 text-[#2D5A43]"
                      title="Bakat Sudah Dianalisis"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </span>
                  ) : (
                    <span
                      className="p-1 rounded-full bg-gray-100 text-gray-400"
                      title="Belum Asesmen"
                    >
                      <Sparkles className="w-4 h-4" />
                    </span>
                  )}
                </div>

                <div className="mt-3 pt-2 border-t border-[#E5DFD1] flex items-center justify-between text-[11px]">
                  <span className="text-[#8D887B]">NISN: {std.nisn}</span>
                  <span className={`font-semibold ${isSelected ? 'text-[#2D5A43]' : 'text-[#5A554A]'}`}>
                    {isSelected ? '✓ Terpilih' : 'Pilih'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-[#FAF7F2] border border-[#E5DFD1] rounded-2xl p-1.5 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1.5 min-w-max">
          <button
            type="button"
            onClick={() => setActiveSubTab('assessment')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeSubTab === 'assessment'
                ? 'bg-[#2D5A43] text-white shadow-xs'
                : 'text-[#5A554A] hover:bg-[#F2EDE4] hover:text-[#2A261F]'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>1. Asesmen & Observasi Bakat</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('results')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeSubTab === 'results'
                ? 'bg-[#2D5A43] text-white shadow-xs'
                : 'text-[#5A554A] hover:bg-[#F2EDE4] hover:text-[#2A261F]'
            }`}
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>2. Hasil Peta Bakat AI</span>
            {currentAnalysis && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('encyclopedia')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeSubTab === 'encyclopedia'
                ? 'bg-[#2D5A43] text-white shadow-xs'
                : 'text-[#5A554A] hover:bg-[#F2EDE4] hover:text-[#2A261F]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>3. Ensiklopedia 8 Kecerdasan</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('print')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeSubTab === 'print'
                ? 'bg-[#2D5A43] text-white shadow-xs'
                : 'text-[#5A554A] hover:bg-[#F2EDE4] hover:text-[#2A261F]'
            }`}
          >
            <Printer className="w-4 h-4" />
            <span>4. Rapor & Cetak Peta Bakat</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: ASESMEN & OBSERVASI BAKAT INTERAKTIF */}
      {/* ========================================================================= */}
      {activeSubTab === 'assessment' && activeStudent && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Questionnaire & Indicators (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Quick Actions & Header */}
            <div className="bg-white rounded-3xl border border-[#E5DFD1] p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base sm:text-lg font-serif font-bold text-[#2A261F] flex items-center gap-2">
                    <Activity className="w-5 h-5 text-[#2D5A43]" />
                    Instrumen Observasi 8 Kecerdasan Majemuk
                  </h3>
                  <p className="text-xs text-[#8D887B]">
                    Isi indikator perilaku yang teramati untuk mengukur kecenderungan bakat alami {activeStudent.fullName}.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleLoadAutoPreset}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#2D5A43] bg-[#EBF3EE] hover:bg-[#DCE7E1] border border-[#2D5A43]/30 transition-all cursor-pointer"
                    title="Isi otomatis berdasarkan catatan karakteristik siswa"
                  >
                    <Flame className="w-3.5 h-3.5 text-amber-600" />
                    <span>Muat Profil Siswa</span>
                  </button>
                </div>
              </div>

              {/* Questionnaire Groups per Dimension */}
              <div className="space-y-6 mt-4">
                {TALENT_DIMENSIONS.map((dim) => {
                  const IconComp = getDimensionIcon(dim.iconName);
                  const questions = TALENT_QUESTIONNAIRE_ITEMS.filter(
                    (q) => q.dimensionKey === dim.key
                  );
                  const currentScore = dimensionScores[dim.key] || 50;

                  return (
                    <div
                      key={dim.key}
                      className={`p-4 sm:p-5 rounded-2xl border ${dim.colorTheme.border} ${dim.colorTheme.bg} space-y-4 transition-all`}
                    >
                      {/* Dimension Title & Score Meter */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5DFD1]/50 pb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center ${dim.colorTheme.badge}`}
                          >
                            <IconComp className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-[#2A261F]">{dim.name}</h4>
                            <p className="text-[11px] text-[#6B685F]">{dim.alias}</p>
                          </div>
                        </div>

                        {/* Interactive Slider / Score Display */}
                        <div className="flex items-center gap-3 bg-white/80 px-3 py-1.5 rounded-xl border border-[#E5DFD1]">
                          <span className="text-xs text-[#8D887B]">Indeks:</span>
                          <input
                            type="range"
                            min="20"
                            max="100"
                            step="5"
                            value={currentScore}
                            onChange={(e) =>
                              setDimensionScores({
                                ...dimensionScores,
                                [dim.key]: parseInt(e.target.value, 10),
                              })
                            }
                            className="w-24 sm:w-32 accent-[#2D5A43] cursor-pointer"
                          />
                          <span className="text-xs font-bold font-mono text-[#2D5A43] w-9 text-right">
                            {currentScore}%
                          </span>
                        </div>
                      </div>

                      {/* Question Checklist (3 Items) */}
                      <div className="space-y-2.5">
                        {questions.map((q, idx) => {
                          const val = questionScores[q.id] || 4;

                          return (
                            <div
                              key={q.id}
                              className="bg-white/90 p-3 rounded-xl border border-[#E5DFD1] flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                            >
                              <div className="flex items-start gap-2 max-w-xl">
                                <span className="text-[11px] font-bold text-[#8D887B] mt-0.5">
                                  {idx + 1}.
                                </span>
                                <p className="text-xs text-[#3D3B36] leading-relaxed">
                                  {q.indicatorText}
                                </p>
                              </div>

                              {/* 5-point Likert scale */}
                              <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
                                {[1, 2, 3, 4, 5].map((lvl) => (
                                  <button
                                    key={lvl}
                                    type="button"
                                    onClick={() => handleQuestionScoreChange(q.id, lvl)}
                                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                      val === lvl
                                        ? 'bg-[#2D5A43] text-white shadow-xs'
                                        : 'bg-[#F2EDE4] text-[#6B685F] hover:bg-[#E5DFD1]'
                                    }`}
                                    title={
                                      lvl === 1
                                        ? '1: Jarang Sekali'
                                        : lvl === 3
                                        ? '3: Cukup Sering'
                                        : lvl === 5
                                        ? '5: Sangat Menonjol'
                                        : `${lvl}`
                                    }
                                  >
                                    {lvl}
                                  </button>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Custom Observation Field */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-bold text-[#4A4E3D]">
                  Catatan Tambahan Pengamatan Guru / Orang Tua (Opsional):
                </label>
                <textarea
                  rows={3}
                  value={customObservationNotes}
                  onChange={(e) => setCustomObservationNotes(e.target.value)}
                  placeholder="Tuliskan karya unik, minat khusus, atau perilaku menonjol anak saat bermain / belajar di kelas..."
                  className="w-full text-xs p-3 rounded-xl border border-[#D9D4C7] bg-[#FAF7F2] focus:bg-white focus:ring-2 focus:ring-[#2D5A43] focus:outline-hidden"
                />
              </div>

              {/* Run AI Analysis CTA */}
              <div className="pt-4 border-t border-[#E5DFD1] flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-[#8D887B]">
                  <ShieldCheck className="w-4 h-4 text-[#2D5A43]" />
                  <span>Pendekatan Non-Diagnostik Berbasis Kekuatan & Multiple Intelligences</span>
                </div>

                <button
                  type="button"
                  onClick={handleRunAIAnalysis}
                  disabled={isAnalyzing}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-white bg-[#2D5A43] hover:bg-[#234735] shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>AI Sedang Memetakan Bakat...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-emerald-200" />
                      <span>Proses Analisis Bakat dengan AI</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Live Radar & Dominant Preview (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Live Dimension Progress Bars */}
            <div className="bg-white rounded-3xl border border-[#E5DFD1] p-5 shadow-xs space-y-4 sticky top-28">
              <div className="flex items-center justify-between border-b border-[#E5DFD1] pb-3">
                <h3 className="text-sm font-serif font-bold text-[#2A261F] flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#2D5A43]" />
                  Grafik Skor Kecerdasan
                </h3>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#EBF3EE] text-[#2D5A43] font-bold">
                  Live
                </span>
              </div>

              {/* Progress Bars */}
              <div className="space-y-3">
                {TALENT_DIMENSIONS.map((dim) => {
                  const score = dimensionScores[dim.key] || 50;
                  const Icon = getDimensionIcon(dim.iconName);

                  return (
                    <div key={dim.key} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5 text-[#3D3B36] font-medium">
                          <Icon className="w-3.5 h-3.5 text-[#6B685F]" />
                          {dim.name}
                        </span>
                        <span className="font-mono font-bold text-[#2D5A43]">{score}%</span>
                      </div>
                      <div className="w-full bg-[#F2EDE4] h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${dim.colorTheme.bar} rounded-full transition-all duration-500`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Top 3 Predicted Dominant Preview */}
              <div className="mt-4 pt-4 border-t border-[#E5DFD1] space-y-2">
                <h4 className="text-xs font-bold text-[#6B685F] uppercase tracking-wider">
                  Prediksi Bakat Dominan:
                </h4>
                {Object.entries(dimensionScores)
                  .sort(([, a], [, b]) => Number(b) - Number(a))
                  .slice(0, 3)
                  .map(([key, sc], idx) => {
                    const meta = TALENT_DIMENSIONS.find((d) => d.key === key);
                    if (!meta) return null;
                    const Icon = getDimensionIcon(meta.iconName);

                    return (
                      <div
                        key={key}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5DFD1] text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                              idx === 0
                                ? 'bg-amber-400 text-amber-950'
                                : idx === 1
                                ? 'bg-gray-300 text-gray-800'
                                : 'bg-amber-700 text-white'
                            }`}
                          >
                            {idx + 1}
                          </span>
                          <Icon className="w-3.5 h-3.5 text-[#2D5A43]" />
                          <span className="font-semibold text-[#2A261F]">{meta.name}</span>
                        </div>
                        <span className="font-bold text-[#2D5A43]">{sc}%</span>
                      </div>
                    );
                  })}
              </div>

              {/* Quick AI Trigger button */}
              <button
                type="button"
                onClick={handleRunAIAnalysis}
                disabled={isAnalyzing}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-[#2D5A43] hover:bg-[#234735] shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
                <span>Lihat Hasil Analisis Lengkap</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: HASIL PEMETAAN BAKAT & REKOMENDASI AI */}
      {/* ========================================================================= */}
      {activeSubTab === 'results' && activeStudent && (
        <div className="space-y-6">
          {!currentAnalysis ? (
            <div className="bg-white rounded-3xl border border-[#E5DFD1] p-12 text-center space-y-4 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-full bg-[#EBF3EE] text-[#2D5A43] flex items-center justify-center mx-auto">
                <Brain className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-serif font-bold text-[#2A261F]">
                Belum Ada Analisis Bakat untuk {activeStudent.fullName}
              </h3>
              <p className="text-xs text-[#8D887B] leading-relaxed">
                Silakan lakukan observasi di Tab 1 (Asesmen & Observasi Bakat) dan klik tombol Analisis dengan AI.
              </p>
              <button
                type="button"
                onClick={() => setActiveSubTab('assessment')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#2D5A43] hover:bg-[#234735] transition-all cursor-pointer"
              >
                <Activity className="w-4 h-4" />
                <span>Mulai Asesmen Sekarang</span>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Profile Summary Card */}
              <div className="bg-white rounded-3xl border border-[#E5DFD1] p-6 sm:p-7 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5DFD1] pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EBF3EE] text-[#2D5A43] border border-[#2D5A43]/30">
                        {currentAnalysis.educationLevel} • {currentAnalysis.gradeClass}
                      </span>
                      <span className="text-xs text-[#8D887B]">
                        Tanggal Asesmen: {currentAnalysis.assessedDate}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#2A261F] mt-1">
                      Profil Bakat & Potensi: {currentAnalysis.studentName}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveSubTab('print')}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#4A4E3D] bg-[#F2EDE4] hover:bg-[#E9E4D8] border border-[#D9D4C7] transition-all cursor-pointer"
                    >
                      <Printer className="w-4 h-4 text-[#2D5A43]" />
                      <span>Cetak Lembar Rapor Bakat</span>
                    </button>
                  </div>
                </div>

                {/* Synthesis Narrative */}
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E5DFD1] text-xs sm:text-sm text-[#3D3B36] leading-relaxed">
                  <div className="font-bold text-[#2D5A43] mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    Sintesis Karakteristik Bakat & Gaya Belajar:
                  </div>
                  {currentAnalysis.overallSummary}
                </div>
              </div>

              {/* Dominant Talents Grid (Top 3) */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-500" />
                  <h3 className="text-base sm:text-lg font-serif font-bold text-[#2A261F]">
                    3 Pilar Bakat Dominan (Top Strengths)
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {currentAnalysis.dominantTalents.map((talent, idx) => {
                    const meta = TALENT_DIMENSIONS.find((d) => d.key === talent.dimensionKey);
                    const Icon = getDimensionIcon(meta?.iconName || 'Sparkles');

                    return (
                      <div
                        key={talent.dimensionKey}
                        className={`rounded-3xl border p-5 space-y-3.5 relative overflow-hidden flex flex-col justify-between ${
                          idx === 0
                            ? 'bg-gradient-to-b from-amber-50 to-white border-amber-300 shadow-sm'
                            : idx === 1
                            ? 'bg-gradient-to-b from-blue-50 to-white border-blue-300 shadow-sm'
                            : 'bg-gradient-to-b from-emerald-50 to-white border-emerald-300 shadow-sm'
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                                idx === 0
                                  ? 'bg-amber-400 text-amber-950'
                                  : idx === 1
                                  ? 'bg-blue-400 text-blue-950'
                                  : 'bg-emerald-400 text-emerald-950'
                              }`}
                            >
                              #{idx + 1}
                            </span>
                            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-white border border-[#E5DFD1]">
                              Skor {talent.score}%
                            </span>
                          </div>

                          <div className="flex items-center gap-2.5">
                            <div className="p-2 rounded-xl bg-white border border-[#E5DFD1] text-[#2D5A43]">
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-[#2A261F]">{talent.dimensionName}</h4>
                              <span className="text-[10px] font-semibold text-emerald-700">
                                {talent.level}
                              </span>
                            </div>
                          </div>

                          <p className="text-xs text-[#5A554A] leading-relaxed">
                            {talent.strengthsDescription}
                          </p>

                          {/* Observed Behaviors */}
                          {talent.observedBehaviors && talent.observedBehaviors.length > 0 && (
                            <div className="space-y-1.5 pt-2 border-t border-[#E5DFD1]/60">
                              <span className="text-[11px] font-bold text-[#6B685F]">
                                Perilaku Teramati:
                              </span>
                              <ul className="space-y-1">
                                {talent.observedBehaviors.map((b, bIdx) => (
                                  <li
                                    key={bIdx}
                                    className="text-[11px] text-[#4A4E3D] flex items-start gap-1.5"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2D5A43] shrink-0 mt-0.5" />
                                    <span>{b}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recommendations Bento Grid (4 Cards) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Rekomendasi Ekstrakurikuler & Pelatihan */}
                <div className="bg-white rounded-3xl border border-[#E5DFD1] p-6 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 text-[#2D5A43] border-b border-[#E5DFD1] pb-3">
                    <School className="w-5 h-5" />
                    <h4 className="text-base font-serif font-bold text-[#2A261F]">
                      Rekomendasi Ekstrakurikuler & Klub Sekolah
                    </h4>
                  </div>

                  <div className="space-y-3">
                    {currentAnalysis.recommendedExtracurriculars.map((ekskul, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E5DFD1] space-y-1 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#2A261F]">{ekskul.name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#EBF3EE] text-[#2D5A43] font-semibold">
                            {ekskul.category}
                          </span>
                        </div>
                        <p className="text-[#6B685F] text-[11px] leading-relaxed">{ekskul.rationale}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Rekomendasi Lomba & Ajang Prestasi */}
                <div className="bg-white rounded-3xl border border-[#E5DFD1] p-6 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 text-amber-600 border-b border-[#E5DFD1] pb-3">
                    <Trophy className="w-5 h-5" />
                    <h4 className="text-base font-serif font-bold text-[#2A261F]">
                      Rekomendasi Kompetisi & Ajang Prestasi
                    </h4>
                  </div>

                  <div className="space-y-3">
                    {currentAnalysis.recommendedCompetitions.map((lomba, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E5DFD1] space-y-1 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#2A261F]">{lomba.title}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-semibold">
                            {lomba.level}
                          </span>
                        </div>
                        <p className="text-[#6B685F] text-[11px] leading-relaxed">
                          <strong className="text-[#3D3B36]">Tips Persiapan:</strong>{' '}
                          {lomba.preparationTip}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Strategi Stimulasi Guru di Kelas */}
                <div className="bg-white rounded-3xl border border-[#E5DFD1] p-6 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 text-[#2D5A43] border-b border-[#E5DFD1] pb-3">
                    <BookOpen className="w-5 h-5" />
                    <h4 className="text-base font-serif font-bold text-[#2A261F]">
                      Strategi Diferensiasi Guru di Kelas
                    </h4>
                  </div>

                  <ul className="space-y-2.5">
                    {currentAnalysis.classroomStimulationStrategies.map((strat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-[#3D3B36]">
                        <span className="w-5 h-5 rounded-full bg-[#EBF3EE] text-[#2D5A43] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{strat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 4. Panduan Stimulasi Orang Tua di Rumah */}
                <div className="bg-white rounded-3xl border border-[#E5DFD1] p-6 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 text-teal-700 border-b border-[#E5DFD1] pb-3">
                    <Home className="w-5 h-5" />
                    <h4 className="text-base font-serif font-bold text-[#2A261F]">
                      Panduan Stimulasi Orang Tua di Rumah
                    </h4>
                  </div>

                  <ul className="space-y-2.5">
                    {currentAnalysis.homeStimulationStrategies.map((strat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-[#3D3B36]">
                        <span className="w-5 h-5 rounded-full bg-teal-50 text-teal-800 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{strat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Future Career Directions Synergy */}
              <div className="bg-gradient-to-r from-[#FAF7F2] to-white rounded-3xl border border-[#E5DFD1] p-6 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-[#2D5A43]">
                  <Briefcase className="w-5 h-5" />
                  <h4 className="text-base font-serif font-bold text-[#2A261F]">
                    Prospek Rumpun Karir & Profesi Masa Depan yang Selaras
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                  {currentAnalysis.futureCareerDirections.map((car, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-white border border-[#E5DFD1] space-y-1.5"
                    >
                      <span className="text-xs font-bold text-[#2D5A43] block">{car.field}</span>
                      <div className="flex flex-wrap gap-1.5">
                        {car.exampleProfessions.map((prof, pIdx) => (
                          <span
                            key={pIdx}
                            className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#F2EDE4] text-[#4A4E3D]"
                          >
                            {prof}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Disclaimer */}
              <div className="p-4 rounded-2xl bg-[#F2EDE4]/60 border border-[#E5DFD1] text-[11px] text-[#8D887B] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#2D5A43] shrink-0" />
                <span>{currentAnalysis.nonDiagnosticDisclaimer}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 3: ENSIKLOPEDIA 8 KECERDASAN MAJEMUK */}
      {/* ========================================================================= */}
      {activeSubTab === 'encyclopedia' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-[#E5DFD1] p-6 shadow-xs space-y-3">
            <h3 className="text-lg font-serif font-bold text-[#2A261F] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#2D5A43]" />
              Ensiklopedia 8 Kecerdasan Majemuk (Howard Gardner Theory)
            </h3>
            <p className="text-xs text-[#8D887B] leading-relaxed max-w-3xl">
              Setiap anak dilahirkan dengan profil kecerdasan majemuk yang unik. Pelajari karakteristik, ciri perilaku khas, tokoh inspiratif, dan media belajar yang tepat untuk setiap dimensi bakat.
            </p>

            {/* Dimension Selection Pills */}
            <div className="flex items-center gap-2 flex-wrap pt-2">
              {TALENT_DIMENSIONS.map((dim) => {
                const Icon = getDimensionIcon(dim.iconName);
                const isSel = selectedEncyclopediaKey === dim.key;

                return (
                  <button
                    key={dim.key}
                    type="button"
                    onClick={() => setSelectedEncyclopediaKey(dim.key)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isSel
                        ? 'bg-[#2D5A43] text-white shadow-2xs'
                        : 'bg-[#F2EDE4] text-[#5A554A] hover:bg-[#E8E2D5]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{dim.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Dimension Deep Dive */}
          {(() => {
            const selectedDim =
              TALENT_DIMENSIONS.find((d) => d.key === selectedEncyclopediaKey) ||
              TALENT_DIMENSIONS[0];
            const Icon = getDimensionIcon(selectedDim.iconName);

            return (
              <div className="bg-white rounded-3xl border border-[#E5DFD1] p-6 sm:p-8 shadow-xs space-y-6">
                {/* Banner */}
                <div
                  className={`p-6 rounded-2xl border ${selectedDim.colorTheme.border} ${selectedDim.colorTheme.bg} flex flex-col sm:flex-row sm:items-center justify-between gap-4`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center ${selectedDim.colorTheme.badge}`}
                    >
                      <Icon className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-serif font-bold text-[#2A261F]">
                        {selectedDim.name}
                      </h3>
                      <p className="text-xs text-[#6B685F] mt-0.5">{selectedDim.alias}</p>
                    </div>
                  </div>
                </div>

                <div className="text-xs sm:text-sm text-[#3D3B36] leading-relaxed">
                  <strong className="text-[#2D5A43]">Definisi & Esensi:</strong> {selectedDim.description}
                </div>

                {/* 3 Detail Columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                  {/* Ciri Indikator */}
                  <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E5DFD1] space-y-3">
                    <h4 className="text-xs font-bold text-[#2A261F] flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-[#2D5A43]" />
                      Indikator Perilaku Khas:
                    </h4>
                    <ul className="space-y-2">
                      {selectedDim.keyIndicators.map((ind, i) => (
                        <li key={i} className="text-xs text-[#5A554A] flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#2D5A43] shrink-0 mt-0.5" />
                          <span>{ind}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Kegiatan Favorit & Tokoh */}
                  <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E5DFD1] space-y-3">
                    <h4 className="text-xs font-bold text-[#2A261F] flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-amber-500" />
                      Kegiatan & Tokoh Inspiratif:
                    </h4>
                    <div className="space-y-2">
                      <span className="text-[11px] font-semibold text-[#8D887B]">Aktivitas yang Disukai:</span>
                      <ul className="space-y-1">
                        {selectedDim.preferredActivities.map((act, i) => (
                          <li key={i} className="text-xs text-[#5A554A] flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#2D5A43]" />
                            <span>{act}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="pt-2 border-t border-[#E5DFD1]">
                        <span className="text-[11px] font-semibold text-[#8D887B]">Tokoh Inspiratif:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedDim.inspiringFigures.map((fig, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#EBF3EE] text-[#2D5A43]"
                            >
                              {fig}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Media Belajar Terbaik */}
                  <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E5DFD1] space-y-3">
                    <h4 className="text-xs font-bold text-[#2A261F] flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-purple-600" />
                      Media & Perangkat Belajar Terbaik:
                    </h4>
                    <ul className="space-y-2">
                      {selectedDim.recommendedLearningMedia.map((med, i) => (
                        <li key={i} className="text-xs text-[#5A554A] flex items-start gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                          <span>{med}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 4: RAPOR & CETAK PETA BAKAT (PRINT READY) */}
      {/* ========================================================================= */}
      {activeSubTab === 'print' && activeStudent && (
        <div className="space-y-6">
          {/* Action Bar */}
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-[#E5DFD1]">
            <span className="text-xs text-[#8D887B]">
              Format Dokumen Resmi Siap Cetak (A4 Portrait). Gunakan tombol cetak untuk menyimpan sebagai PDF.
            </span>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#2D5A43] hover:bg-[#234735] shadow-xs transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>
          </div>

          {/* Printable Report Document */}
          <div className="bg-white rounded-3xl border border-[#D9D4C7] p-8 sm:p-12 shadow-sm max-w-4xl mx-auto space-y-6 text-[#2A261F] print:p-0 print:border-none print:shadow-none">
            {/* Kop Surat Resmi */}
            <div className="border-b-2 border-[#2A261F] pb-4 text-center space-y-1">
              <div className="text-xs uppercase tracking-widest text-[#6B685F] font-bold">
                Pusat Layanan Asesmen Bakat & Perkembangan Belajar Siswa
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#2A261F]">
                LEMBAR LAPORAN PEMETAAN BAKAT & POTENSI SISWA
              </h2>
              <div className="text-xs text-[#6B685F]">
                Mengacu pada Teori Multiple Intelligences (Howard Gardner) & Kerangka Kurikulum Merdeka
              </div>
            </div>

            {/* Identitas Siswa */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-[#FAF7F2] border border-[#E5DFD1] text-xs">
              <div>
                <span className="text-[#8D887B] block">Nama Lengkap:</span>
                <strong className="text-[#2A261F]">{activeStudent.fullName}</strong>
              </div>
              <div>
                <span className="text-[#8D887B] block">NISN / ID:</span>
                <strong className="text-[#2A261F]">{activeStudent.nisn}</strong>
              </div>
              <div>
                <span className="text-[#8D887B] block">Jenjang & Kelas:</span>
                <strong className="text-[#2A261F]">
                  {activeStudent.educationLevel} ({activeStudent.gradeClass})
                </strong>
              </div>
              <div>
                <span className="text-[#8D887B] block">Usia:</span>
                <strong className="text-[#2A261F]">
                  {activeStudent.ageYears} Tahun {activeStudent.ageMonths} Bulan
                </strong>
              </div>
            </div>

            {/* Skor 8 Dimensi Tabel */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-[#2A261F] flex items-center gap-1.5">
                <BarChartIcon className="w-4 h-4 text-[#2D5A43]" />
                Rekapitulasi Indeks 8 Dimensi Kecerdasan Majemuk:
              </h3>
              <table className="w-full text-left text-xs border border-[#E5DFD1] rounded-xl overflow-hidden">
                <thead className="bg-[#F2EDE4] text-[#4A4E3D] font-bold">
                  <tr>
                    <th className="p-2.5 border-b border-[#E5DFD1]">Dimensi Kecerdasan</th>
                    <th className="p-2.5 border-b border-[#E5DFD1]">Fokus Domain</th>
                    <th className="p-2.5 border-b border-[#E5DFD1] text-center">Skor (0-100)</th>
                    <th className="p-2.5 border-b border-[#E5DFD1]">Kategori Potensi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5DFD1]">
                  {TALENT_DIMENSIONS.map((dim) => {
                    const sc = dimensionScores[dim.key] || 50;
                    const cat =
                      sc >= 85
                        ? 'Sangat Dominan (Superior)'
                        : sc >= 70
                        ? 'Kuat & Menonjol'
                        : sc >= 55
                        ? 'Cukup Berkembang'
                        : 'Perlu Stimulasi';

                    return (
                      <tr key={dim.key} className="hover:bg-[#FAF7F2]">
                        <td className="p-2.5 font-bold text-[#2A261F]">{dim.name}</td>
                        <td className="p-2.5 text-[#6B685F]">{dim.alias}</td>
                        <td className="p-2.5 text-center font-mono font-bold text-[#2D5A43]">{sc}%</td>
                        <td className="p-2.5">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              sc >= 85
                                ? 'bg-amber-100 text-amber-900'
                                : sc >= 70
                                ? 'bg-emerald-100 text-emerald-900'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {cat}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Kesimpulan & Rekomendasi */}
            {currentAnalysis && (
              <div className="space-y-4 pt-2 border-t border-[#E5DFD1]">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-[#2A261F] uppercase tracking-wider">
                    Sintesis Bakat Utama & Rekomendasi Pengembangan:
                  </h4>
                  <p className="text-xs text-[#4A4E3D] leading-relaxed bg-[#FAF7F2] p-3 rounded-xl border border-[#E5DFD1]">
                    {currentAnalysis.overallSummary}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <strong className="text-[#2D5A43] block">Ekstrakurikuler yang Disarankan:</strong>
                    <ul className="list-disc pl-4 space-y-0.5 text-[#5A554A]">
                      {currentAnalysis.recommendedExtracurriculars.map((e, idx) => (
                        <li key={idx}>
                          {e.name} ({e.category})
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-1">
                    <strong className="text-amber-800 block">Prospek Ajang Prestasi:</strong>
                    <ul className="list-disc pl-4 space-y-0.5 text-[#5A554A]">
                      {currentAnalysis.recommendedCompetitions.map((l, idx) => (
                        <li key={idx}>
                          {l.title} - {l.level}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Tanda Tangan Resmi */}
            <div className="grid grid-cols-3 gap-4 pt-8 text-center text-xs text-[#2A261F]">
              <div className="space-y-12">
                <div>Wali Murid / Orang Tua,</div>
                <div className="font-bold underline">{activeStudent.parentName}</div>
              </div>
              <div className="space-y-12">
                <div>Guru / Konselor BK,</div>
                <div className="font-bold underline">
                  {currentUser?.name || 'Bagus Pratama, S.Psi.'}
                </div>
              </div>
              <div className="space-y-12">
                <div>Kepala Sekolah,</div>
                <div className="font-bold underline">Dra. Hj. Nurul Hidayah, M.Pd.</div>
              </div>
            </div>

            {/* Footnote */}
            <div className="pt-4 border-t border-[#E5DFD1] text-[10px] text-[#8D887B] text-center">
              Dokumen ini diterbitkan oleh NeuroPedagogy.ID untuk pemetaan potensi belajar non-diagnostik.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function BarChartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="20" y2="10" />
      <line x1="18" x2="18" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="16" />
    </svg>
  );
}
