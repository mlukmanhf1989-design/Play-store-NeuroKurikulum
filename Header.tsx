import React from 'react';
import {
  Brain,
  Sparkles,
  Printer,
  RotateCcw,
  BookOpen,
  UserCheck,
  FileText,
  Activity,
  Layers,
  CalendarCheck,
  MessageCircle,
  HelpCircle,
  Leaf,
  Users,
  Trophy,
  Compass,
  LogIn,
  Shield,
  GraduationCap,
  HeartHandshake,
  Server,
  Video,
  Building2,
  Phone,
  Globe2,
  FlaskConical
} from 'lucide-react';
import { SampleCase, UserProfile } from '../types';

export type AppViewMode = 'assessment' | 'database' | 'talents' | 'achievements' | 'sma_majors' | 'login' | 'partnership' | 'curriculum_frameworks' | 'free_trial';

interface HeaderProps {
  activeView: AppViewMode;
  setActiveView: (view: AppViewMode) => void;
  activeStep: number;
  setActiveStep: (step: number) => void;
  sampleCases: SampleCase[];
  selectedCaseId: string | null;
  onSelectCase: (caseItem: SampleCase) => void;
  onReset: () => void;
  onPrint: () => void;
  onOpenGuide: () => void;
  onOpenLogin: () => void;
  onLogout?: () => void;
  onOpenMasterControl?: () => void;
  currentUser: UserProfile;
  hasAnalysis: boolean;
  onToggleChat: () => void;
  isChatOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  activeStep,
  setActiveStep,
  sampleCases,
  selectedCaseId,
  onSelectCase,
  onReset,
  onPrint,
  onOpenGuide,
  onOpenLogin,
  onLogout,
  onOpenMasterControl,
  currentUser,
  hasAnalysis,
  onToggleChat,
  isChatOpen,
}) => {
  const steps = [
    { num: 1, label: 'Input Observasi', icon: Activity },
    { num: 2, label: 'Profil Perkembangan', icon: Brain },
    { num: 3, label: 'Interpretasi Pedagogis', icon: BookOpen },
    { num: 4, label: 'Rekomendasi Kurikulum', icon: Layers },
    { num: 5, label: 'Desain Pembelajaran', icon: CalendarCheck },
  ];

  const isServerRole = ['superadmin', 'kurikulum', 'psikolog', 'peneliti'].includes(currentUser.role);
  const isSuperAdmin = currentUser.role === 'superadmin';

  return (
    <header className="bg-[#FAF8F5] border-b border-[#E6DFD5] sticky top-0 z-30 shadow-xs">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo & Branding */}
          <div
            onClick={() => setActiveView('assessment')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-[#0d5b44] via-[#14785c] to-[#1a936f] flex items-center justify-center text-white shadow-lg shadow-emerald-900/15 ring-1 ring-white/20 group-hover:scale-[1.03] transition-transform">
              <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-300" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-sm sm:text-lg lg:text-xl font-bold font-serif text-[#1F2937] tracking-tight leading-tight">
                  NeuroKurikulum AI
                </h1>
                <span className="hidden xl:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F0EC] text-[#1E3A2F] border border-[#1E3A2F]/30">
                  <UserCheck className="w-3 h-3 mr-1 text-[#1E3A2F]" /> Standar Non-Diagnostik
                </span>
              </div>
              <p className="text-[11px] text-[#6B7280] hidden md:block">
                Asesmen neuropsikologi • Diferensiasi kurikulum • Pemetaan potensi siswa
              </p>
            </div>
          </div>

          {/* Quick Case Switcher & Action Tools */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Preset Cases dropdown (when in assessment mode) */}
            {activeView === 'assessment' && (
              <div className="relative hidden sm:block">
                <select
                  aria-label="Pilih Kasus Contoh"
                  value={selectedCaseId || ''}
                  onChange={(e) => {
                    const found = sampleCases.find((c) => c.id === e.target.value);
                    if (found) onSelectCase(found);
                  }}
                  className="text-xs bg-[#F2EDE4] hover:bg-[#E9E4D8] border border-[#D9D4C7] rounded-xl px-3 py-2 text-[#3D3B36] font-medium cursor-pointer transition-colors focus:ring-2 focus:ring-[#1E3A2F] focus:outline-hidden max-w-[130px] sm:max-w-xs truncate shadow-2xs"
                >
                  <option value="" disabled>
                    Contoh Kasus Observasi...
                  </option>
                  {sampleCases.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Server Master Control Button for Server Roles */}
            {isServerRole && onOpenMasterControl && (
              <button
                type="button"
                id="btn-header-server-control"
                onClick={onOpenMasterControl}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-2xs transition-colors cursor-pointer ${
                  isSuperAdmin
                    ? 'bg-rose-700 hover:bg-rose-800 text-white animate-pulse'
                    : 'bg-[#1F2937] hover:bg-black text-white'
                }`}
                title={isSuperAdmin ? 'Panel Server Utama & Reset/Hapus Database' : 'Panel Manajemen Server & Audit Data'}
              >
                <Server className="w-4 h-4 text-emerald-400" />
                <span className="hidden lg:inline">{isSuperAdmin ? 'Server Utama' : 'Panel Server'}</span>
              </button>
            )}

            {/* Panduan Penggunaan / Petunjuk PDF Button */}
            <button
              type="button"
              id="btn-open-guide-pdf"
              onClick={onOpenGuide}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-[#4A4E3D] bg-[#F2EDE4] hover:bg-[#E9E4D8] border border-[#D9D4C7] shadow-2xs transition-colors cursor-pointer"
              title="Buka & Cetak Petunjuk Lengkap PDF"
            >
              <BookOpen className="w-4 h-4 text-[#5A5E4B]" />
              <span className="hidden md:inline">Petunjuk PDF</span>
            </button>

            {/* Chat Assistant Button */}
            {hasAnalysis && (
              <button
                type="button"
                id="btn-toggle-ai-chat"
                onClick={onToggleChat}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  isChatOpen
                    ? 'bg-[#1E3A2F] text-white shadow-xs'
                    : 'bg-[#E8F0EC] text-[#1E3A2F] hover:bg-[#DCE0D0] border border-[#1E3A2F]/30'
                }`}
                title="Buka Konsultasi Ahli Pedagogi AI"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span className="hidden md:inline">Konsultan AI</span>
              </button>
            )}

            {/* Print / Export Report Button */}
            {hasAnalysis && activeView === 'assessment' && (
              <button
                type="button"
                id="btn-print-report-header"
                onClick={onPrint}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-[#4A4E3D] bg-white hover:bg-[#F8F7F2] border border-[#D9D4C7] shadow-2xs transition-colors"
                title="Cetak Dokumen Laporan & PPI"
              >
                <Printer className="w-4 h-4 text-[#1E3A2F]" />
                <span className="hidden md:inline">Cetak Laporan</span>
              </button>
            )}

            {/* Reset Button (for assessment) */}
            {activeView === 'assessment' && (
              <button
                type="button"
                id="btn-reset-assessment"
                onClick={onReset}
                className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-medium text-[#8D887B] hover:text-[#3D3B36] hover:bg-[#F2EDE4] border border-transparent hover:border-[#D9D4C7] transition-colors flex items-center gap-1.5"
                title="Mulai Observasi Baru"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden lg:inline">Reset</span>
              </button>
            )}

            {/* User Profile & Login Button */}
            <button
              type="button"
              id="btn-open-user-login"
              onClick={onOpenLogin}
              className={`inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl border text-[#2A261F] shadow-2xs transition-all text-xs font-semibold cursor-pointer ${
                activeView === 'login'
                  ? 'bg-[#1E3A2F] text-white border-[#1E3A2F]'
                  : 'bg-white hover:bg-[#FAF7F2] border-[#D8D2C5]'
              }`}
              title="Menu Login & Ganti Pengguna"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover border border-[#1E3A2F]"
                referrerPolicy="no-referrer"
              />
              <div className="text-left hidden sm:block">
                <div className={`text-xs font-bold truncate max-w-[120px] ${activeView === 'login' ? 'text-white' : 'text-[#1F2937]'}`}>
                  {currentUser.name}
                </div>
                <div className={`text-[10px] font-medium truncate max-w-[120px] ${activeView === 'login' ? 'text-emerald-200' : 'text-[#1E3A2F]'}`}>
                  {currentUser.roleLabel}
                </div>
              </div>
              <LogIn className={`w-3.5 h-3.5 ${activeView === 'login' ? 'text-white' : 'text-[#8D887B]'}`} />
            </button>
            {currentUser.id !== 'guest' && onLogout && (
              <button type="button" onClick={onLogout}
                className="px-2.5 py-2 rounded-xl text-xs font-bold border border-rose-200 text-rose-700 hover:bg-rose-50"
                title="Keluar dari sesi">
                Keluar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Feature Navigation Menu */}
      <div className="bg-[#FAF7F2] border-t border-[#E5DFD1] overflow-x-auto scrollbar-none px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between py-1.5 gap-2">
          <div className="flex items-center gap-1 sm:gap-2 min-w-max">
            {/* Tab: Uji Coba Gratis */}
            <button
              type="button"
              id="nav-tab-free-trial"
              onClick={() => setActiveView('free_trial')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${activeView === 'free_trial' ? 'bg-amber-500 text-white shadow-xs' : 'text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200'}`}
            >
              <FlaskConical className="w-4 h-4" />
              <span>Uji Coba Gratis</span>
              <span className="text-[9px] px-1.5 py-0.5 bg-emerald-600 text-white rounded-full uppercase">1 Siswa</span>
            </button>

            {/* Tab 1: Asesmen 5 Langkah */}
            <button
              type="button"
              id="nav-tab-assessment"
              onClick={() => setActiveView('assessment')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeView === 'assessment'
                  ? 'bg-[#1E3A2F] text-white shadow-xs'
                  : 'text-[#5A554A] hover:bg-[#F2EDE4] hover:text-[#2A261F]'
              }`}
            >
              <Brain className="w-4 h-4" />
              <span>Asesmen & PPI (5 Langkah)</span>
            </button>

            {/* Tab 2: Database Input Siswa Baru */}
            <button
              type="button"
              id="nav-tab-database"
              onClick={() => setActiveView('database')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeView === 'database'
                  ? 'bg-[#1E3A2F] text-white shadow-xs'
                  : 'text-[#5A554A] hover:bg-[#F2EDE4] hover:text-[#2A261F]'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Database Siswa Baru</span>
              {currentUser.studentLimit && (
                <span className="text-[10px] px-1.5 py-0.2 bg-amber-100 text-amber-900 border border-amber-300 rounded font-bold">
                  Maks. 3
                </span>
              )}
            </button>

            {/* Tab 3: Menu Bakat (Multiple Intelligences) */}
            <button
              type="button"
              id="nav-tab-talents"
              onClick={() => setActiveView('talents')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeView === 'talents'
                  ? 'bg-[#1E3A2F] text-white shadow-xs'
                  : 'text-[#1E3A2F] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Menu Bakat Siswa</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-emerald-600 text-white rounded-full font-bold">
                Bakat
              </span>
            </button>

            {/* Tab: Fase B/C & Kurikulum Internasional */}
            <button type="button" id="nav-tab-curriculum-frameworks" onClick={() => setActiveView('curriculum_frameworks')} className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${activeView === 'curriculum_frameworks' ? 'bg-[#1E3A2F] text-white shadow-xs' : 'text-[#1E3A2F] bg-amber-50 hover:bg-amber-100 border border-amber-200'}`}>
              <Globe2 className="w-4 h-4" />
              <span>Fase B/C · Cambridge · Singapura</span>
            </button>

            {/* Tab 4: Menu Prestasi Anak */}
            <button
              type="button"
              id="nav-tab-achievements"
              onClick={() => setActiveView('achievements')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeView === 'achievements'
                  ? 'bg-[#8A5A36] text-white shadow-xs'
                  : 'text-[#5A554A] hover:bg-[#F2EDE4] hover:text-[#2A261F]'
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Prestasi Siswa</span>
            </button>

            {/* Tab 5: Peminatan Program Studi SMA */}
            <button
              type="button"
              id="nav-tab-sma-majors"
              onClick={() => setActiveView('sma_majors')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeView === 'sma_majors'
                  ? 'bg-purple-800 text-white shadow-xs'
                  : 'text-purple-900 bg-purple-100/70 hover:bg-purple-200/80 border border-purple-200'
              }`}
            >
              <Compass className="w-4 h-4 text-amber-400" />
              <span>Peminatan Prodi SMA (AI)</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-amber-400 text-purple-950 rounded-full font-extrabold uppercase">
                SMA
              </span>
            </button>

            {/* Tab 6: Menu Login & Hak Akses */}
            <button
              type="button"
              id="nav-tab-login-portal"
              onClick={() => setActiveView('login')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeView === 'login'
                  ? 'bg-[#1F2937] text-white shadow-xs'
                  : 'text-[#1F2937] bg-gray-100 hover:bg-gray-200 border border-gray-300'
              }`}
            >
              <LogIn className="w-4 h-4 text-emerald-600" />
              <span>Menu Login</span>
            </button>

            {/* Tab 7: Review Video & Kemitraan IntegrEd Solution */}
            <button
              type="button"
              id="nav-tab-partnership-video"
              onClick={() => setActiveView('partnership')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeView === 'partnership'
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'text-rose-900 bg-rose-50 hover:bg-rose-100 border border-rose-200'
              }`}
            >
              <Video className="w-4 h-4 text-rose-600" />
              <span>Review Video & Kemitraan</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-rose-600 text-white rounded-full font-extrabold uppercase">
                IntegrEd
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Stepper Pipeline Bar (Shown only in Assessment mode) */}
      {activeView === 'assessment' && (
        <div className="bg-[#F2EDE4] border-t border-[#E5DFD1] overflow-x-auto scrollbar-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center justify-between min-w-max py-2 sm:py-2.5 gap-2" aria-label="Alur Observasi">
              {steps.map((step) => {
                const Icon = step.icon;
                const isActive = activeStep === step.num;
                const isPast = activeStep > step.num;
                const isAccessible = step.num === 1 || hasAnalysis;

                return (
                  <button
                    key={step.num}
                    type="button"
                    disabled={!isAccessible}
                    onClick={() => isAccessible && setActiveStep(step.num)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-[#2D5A43] text-white shadow-xs'
                        : isPast
                        ? 'text-[#2D5A43] bg-[#EBF3EE] hover:bg-[#DCE0D0] border border-[#2D5A43]/30'
                        : isAccessible
                        ? 'text-[#6B685F] hover:text-[#3D3B36] hover:bg-white/60'
                        : 'text-[#B0ABA0] cursor-not-allowed opacity-60'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                        isActive
                          ? 'bg-white text-[#2D5A43]'
                          : isPast
                          ? 'bg-[#2D5A43] text-white'
                          : 'bg-[#D9D4C7] text-[#6B685F]'
                      }`}
                    >
                      {step.num}
                    </span>
                    <span>{step.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

