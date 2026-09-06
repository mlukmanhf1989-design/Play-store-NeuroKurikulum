import React, { useState, useEffect } from 'react';
import { Header, AppViewMode } from './components/Header';
import { ObservationInput } from './components/ObservationInput';
import { DevelopmentalProfile } from './components/DevelopmentalProfile';
import { PedagogicalInterpretation } from './components/PedagogicalInterpretation';
import { CurriculumRecommendations } from './components/CurriculumRecommendations';
import { PersonalizedLearningPlan } from './components/PersonalizedLearningPlan';
import { AIPedagogyChat } from './components/AIPedagogyChat';
import { ReportPrintView } from './components/ReportPrintView';
import { ManualGuideModal } from './components/ManualGuideModal';
import { LoginModal } from './components/LoginModal';
import { StudentDatabaseView } from './components/StudentDatabaseView';
import { StudentAchievementsView } from './components/StudentAchievementsView';
import { SMAMajorSelectionView } from './components/SMAMajorSelectionView';
import { TalentMappingView } from './components/TalentMappingView';
import { ServerMasterDatabaseModal } from './components/ServerMasterDatabaseModal';
import { LoginPortalView } from './components/LoginPortalView';
import { PartnershipVideoReviewView } from './components/PartnershipVideoReviewView';
import { FreeTrialView } from './components/FreeTrialView';
import { CurriculumFrameworksView } from './components/CurriculumFrameworksView';
import { SAMPLE_CASES } from './data/sampleCases';
import { generateClientFallbackAnalysis, generateClientFallbackActivity } from './utils/fallbackGenerator';
import {
  DEFAULT_USERS,
  INITIAL_STUDENTS,
  INITIAL_ACHIEVEMENTS,
  INITIAL_AUDIT_LOGS,
} from './data/mockStudentDatabase';
import {
  ComprehensiveAnalysisResult,
  ObservationData,
  SampleCase,
  StudentMasterRecord,
  StudentAchievement,
  UserProfile,
  ServerAuditLog,
  UserRole,
} from './types';
import { AlertCircle, Sparkles, Brain, CheckCircle2, ShieldCheck } from 'lucide-react';

const GUEST_USER: UserProfile = {
  id: 'guest',
  username: '',
  name: 'Belum Login',
  email: '',
  role: 'lembaga',
  roleLabel: 'Pengguna Belum Terautentikasi',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  institutionName: '',
  joinedDate: new Date().toISOString().slice(0,10),
  canReviewAllAccounts: false,
  canDeleteRecords: false,
  canPurgeAllDatabase: false,
};

const INITIAL_OBSERVATION_DATA: ObservationData = {
  childMeta: {
    childName: '',
    ageYears: 5,
    ageMonths: 0,
    gender: 'Laki-laki',
    observerName: '',
    observerRole: 'Guru Kelas',
    observationSetting: 'Ruang Kelas PAUD/TK',
    observationDuration: '30 Menit',
    curriculumTarget: 'Kurikulum Merdeka (PAUD/Fase Fondasi)',
    focusNotes: '',
  },
  selectedIndicators: [],
  anecdotalNotes: '',
  mediaAttachments: [],
};

export default function App() {
  const [activeView, setActiveView] = useState<AppViewMode>('assessment');
  const [activeStep, setActiveStep] = useState<number>(1);
  const [observationData, setObservationData] = useState<ObservationData>(
    () => SAMPLE_CASES[0]?.data || INITIAL_OBSERVATION_DATA
  );
  const [analysisResult, setAnalysisResult] = useState<ComprehensiveAnalysisResult | null>(
    () => (SAMPLE_CASES[0] ? generateClientFallbackAnalysis(SAMPLE_CASES[0].data) : null)
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingPhase, setLoadingPhase] = useState<string>('Memulai observasi...');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(() => SAMPLE_CASES[0]?.id || null);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isServerModalOpen, setIsServerModalOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [isGeneratingActivity, setIsGeneratingActivity] = useState<boolean>(false);

  // User, Student Data & Server Audit State
  const [currentUser, setCurrentUser] = useState<UserProfile>(GUEST_USER);
  const [authToken, setAuthToken] = useState<string | null>(() => localStorage.getItem('neuro_auth_token'));
  const [students, setStudents] = useState<StudentMasterRecord[]>(INITIAL_STUDENTS);
  const [achievements, setAchievements] = useState<StudentAchievement[]>(INITIAL_ACHIEVEMENTS);
  const [auditLogs, setAuditLogs] = useState<ServerAuditLog[]>(INITIAL_AUDIT_LOGS);
  const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>([]);
  const [observationHistory, setObservationHistory] = useState<any[]>([]);

  const [selectedSMAStudent, setSelectedSMAStudent] = useState<StudentMasterRecord | null>(
    INITIAL_STUDENTS.find((s) => s.educationLevel === 'SMA') || null
  );
  const [selectedTalentStudent, setSelectedTalentStudent] = useState<StudentMasterRecord | null>(
    INITIAL_STUDENTS[0] || null
  );
  const [achievementStudentFilter, setAchievementStudentFilter] = useState<string | null>(null);

  const apiFetch = (url: string, options: RequestInit = {}) => {
    const headers = new Headers(options.headers || {});
    if (authToken) headers.set('Authorization', `Bearer ${authToken}`);
    return fetch(url, { ...options, headers });
  };

  const applyAuth = (result: { user: UserProfile; token: string }) => {
    setCurrentUser(result.user);
    setAuthToken(result.token);
    localStorage.setItem('neuro_auth_token', result.token);
  };

  const handleAuthenticate = async (username: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'Login gagal.');
    applyAuth(data);
  };

  const handleRegister = async (input: { name: string; username: string; password: string; token: string; role: UserRole; city?: string }) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'Registrasi gagal.');
    applyAuth(data);
  };

  const refreshRegisteredUsers = async () => {
    if (currentUser.role !== 'superadmin') return;
    const response = await apiFetch('/api/admin/users');
    if (!response.ok) throw new Error('Gagal mengambil daftar pengguna.');
    const data = await response.json();
    setRegisteredUsers(Array.isArray(data.users) ? data.users : []);
  };

  const handleDeleteUser = async (id: string) => {
    const response = await apiFetch(`/api/admin/users/${id}`, { method: 'DELETE' });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'Gagal menghapus pengguna.');
    setRegisteredUsers(prev => prev.filter(u => u.id !== id));
    triggerSuccessToast('Akun pengguna berhasil dihapus.');
  };

  const handlePurgeUsers = async () => {
    const response = await apiFetch('/api/admin/users/purge', { method: 'POST' });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'Gagal menghapus akun pengguna.');
    setRegisteredUsers([]);
    triggerSuccessToast(`Seluruh akun pengguna terdaftar berhasil dihapus (${data.deleted || 0}).`);
  };

  const handleLogout = () => {
    localStorage.removeItem('neuro_auth_token');
    setAuthToken(null);
    setCurrentUser(GUEST_USER);
    setActiveView('login');
    setIsServerModalOpen(false);
  };

  useEffect(() => {
    const token = localStorage.getItem('neuro_auth_token');
    if (!token) {
      setActiveView('login');
      return;
    }
    fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : Promise.reject(new Error('Sesi berakhir')))
      .then(data => {
        setCurrentUser(data.user);
        setAuthToken(token);
        return apiFetch('/api/database/snapshot', { headers: { Authorization: `Bearer ${token}` } });
      })
      .then(r => r?.ok ? r.json() : Promise.reject(new Error('Database unavailable')))
      .then(snapshot => {
        if (Array.isArray(snapshot.students)) setStudents(snapshot.students);
        if (Array.isArray(snapshot.achievements)) setAchievements(snapshot.achievements);
        if (Array.isArray(snapshot.auditLogs)) setAuditLogs(snapshot.auditLogs);
        if (Array.isArray(snapshot.observations)) setObservationHistory(snapshot.observations);
      })
      .catch(() => {
        localStorage.removeItem('neuro_auth_token');
        setAuthToken(null);
        setCurrentUser(GUEST_USER);
        setActiveView('login');
      });
  }, []);

  useEffect(() => {
    if (authToken && currentUser.role === 'superadmin') {
      refreshRegisteredUsers().catch(() => undefined);
    }
  }, [authToken, currentUser.role]);

  useEffect(() => {
    if (!authToken) return;
    apiFetch('/api/database/snapshot')
      .then(r => r.ok ? r.json() : Promise.reject(new Error('Database unavailable')))
      .then(snapshot => {
        if (Array.isArray(snapshot.students)) setStudents(snapshot.students);
        if (Array.isArray(snapshot.achievements)) setAchievements(snapshot.achievements);
        if (Array.isArray(snapshot.auditLogs)) setAuditLogs(snapshot.auditLogs);
        if (Array.isArray(snapshot.observations)) setObservationHistory(snapshot.observations);
      })
      .catch(() => setErrorMessage('Database belum dapat diakses.'));
  }, [authToken]);


  const triggerSuccessToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const logServerAction = (
    actionType: ServerAuditLog['actionType'],
    targetDetails: string,
    status: ServerAuditLog['status'] = 'SUCCESS'
  ) => {
    const newLog: ServerAuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: currentUser.role,
      actionType,
      targetDetails,
      status,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
    apiFetch('/api/database/audit', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(newLog) }).catch(() => undefined);
  };

  const runAnalysis = async (dataToAnalyze: ObservationData, switchStep = true, customPrompt?: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    setLoadingPhase('Menganalisis indikator neuropsikologi & pemrosesan sensori...');

    try {
      const response = await fetch('/api/analyze-observation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childMeta: dataToAnalyze.childMeta,
          selectedIndicators: dataToAnalyze.selectedIndicators,
          anecdotalNotes: dataToAnalyze.anecdotalNotes,
          mediaAttachments: dataToAnalyze.mediaAttachments,
          userCustomPrompt: customPrompt,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `Server error: ${response.status}`);
      }

      const result: ComprehensiveAnalysisResult = await response.json();
      setAnalysisResult(result);
      const savedObservation = {
        id: `obs-${Date.now()}`,
        createdAt: new Date().toISOString(),
        childName: dataToAnalyze.childMeta.childName,
        curriculumTarget: dataToAnalyze.childMeta.curriculumTarget,
        selectedIndicators: dataToAnalyze.selectedIndicators,
        anecdotalNotes: dataToAnalyze.anecdotalNotes,
        mediaCount: dataToAnalyze.mediaAttachments?.length || 0,
        analysis: result,
      };
      setObservationHistory(prev => [savedObservation, ...prev]);
      apiFetch('/api/database/observations', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(savedObservation) }).catch(() => undefined);

      if (switchStep) {
        setActiveView('assessment');
        setActiveStep(2); // Jump to Developmental Profile
      }
      triggerSuccessToast('Analisis neuropsikologi & diferensiasi kurikulum berhasil disusun.');
    } catch (err: any) {
      console.warn('API error or network delay, generating client-side fallback analysis:', err);
      const fallbackResult = generateClientFallbackAnalysis(dataToAnalyze);
      setAnalysisResult(fallbackResult);
      if (switchStep) {
        setActiveView('assessment');
        setActiveStep(2);
      }
      triggerSuccessToast('Analisis cerdas disintesis berdasarkan indikator observasi anak.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartTrial = async (name: string, email: string) => {
    const response = await fetch('/api/auth/trial', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'Uji coba gratis gagal dimulai.');
    applyAuth(data);
    setActiveView('free_trial');
    setActiveStep(1);
    triggerSuccessToast('Uji coba gratis aktif. Anda dapat menambahkan 1 siswa.');
  };

  const handleSelectCase = (caseItem: SampleCase) => {
    setSelectedCaseId(caseItem.id);
    setObservationData(caseItem.data);
    const instantAnalysis = generateClientFallbackAnalysis(caseItem.data);
    setAnalysisResult(instantAnalysis);
    setActiveView('assessment');
    setActiveStep(1);
    triggerSuccessToast(`Kasus "${caseItem.data.childMeta.childName}" berhasil dimuat.`);
  };

  const handleReset = () => {
    setSelectedCaseId(null);
    setObservationData(INITIAL_OBSERVATION_DATA);
    setAnalysisResult(null);
    setActiveStep(1);
    setErrorMessage(null);
  };

  // Student Database Operations
  const handleAddStudent = (newStudent: StudentMasterRecord) => {
    // Check limit for Lembaga
    if (currentUser.isTrial && students.filter(s => s.ownerId === currentUser.id).length >= 1) {
      setErrorMessage('Uji coba gratis hanya dapat digunakan untuk 1 siswa.');
      return;
    }
    if (currentUser.role === 'lembaga' && !currentUser.isTrial && students.length >= 3) {
      setErrorMessage('Kuota akun Lembaga Pendidikan maksimal 3 siswa. Hapus siswa lama atau gunakan akun server untuk menambah.');
      return;
    }
    apiFetch('/api/database/students', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(currentUser.isTrial ? { ...newStudent, ownerId: currentUser.id } : newStudent) })
      .then(r => { if (!r.ok) throw new Error('Gagal menyimpan siswa'); return r.json(); })
      .then(saved => { setStudents(prev => [saved, ...prev.filter(s => s.id !== saved.id)]); })
      .catch(() => setStudents(prev => [newStudent, ...prev]));
    logServerAction(
      'UPDATE_STUDENT',
      `Tambah Siswa: ${newStudent.fullName} (NISN: ${newStudent.nisn}, ${newStudent.educationLevel} - ${newStudent.gradeClass})`
    );
    triggerSuccessToast(`Siswa "${newStudent.fullName}" berhasil ditambahkan ke database.`);
  };

  const handleUpdateStudent = (updatedStudent: StudentMasterRecord) => {
    apiFetch(`/api/database/students/${updatedStudent.id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(updatedStudent) }).catch(() => undefined);
    setStudents(students.map((s) => (s.id === updatedStudent.id ? updatedStudent : s)));
    logServerAction(
      'UPDATE_STUDENT',
      `Update Data: ${updatedStudent.fullName} (NISN: ${updatedStudent.nisn})`
    );
    triggerSuccessToast(`Data siswa "${updatedStudent.fullName}" berhasil diperbarui.`);
  };

  const handleDeleteStudent = (studentId: string) => {
    const targetStudent = students.find((s) => s.id === studentId);
    const targetName = targetStudent ? targetStudent.fullName : studentId;

    apiFetch(`/api/database/students/${studentId}`, { method:'DELETE' }).catch(() => undefined);
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
    setAchievements((prev) => prev.filter((a) => a.studentId !== studentId));

    logServerAction(
      'DELETE_STUDENT',
      `Hapus Siswa: ${targetName} beserta relasi asesmen dan prestasinya`
    );
    triggerSuccessToast(`Data siswa "${targetName}" berhasil dihapus.`);
  };

  // Master Server Operations: Purge & Reset
  const handlePurgeAllDatabase = () => {
    const deletedCount = students.length;
    apiFetch('/api/database/purge', { method:'POST' }).catch(() => undefined);
    setStudents([]);
    setAchievements([]);
    setAnalysisResult(null);
    setSelectedSMAStudent(null);
    setSelectedTalentStudent(null);

    logServerAction(
      'PURGE_ALL_DATABASE',
      `Otoritas Server Utama: Menghapus total ${deletedCount} siswa dan seluruh record prestasi secara permanen`
    );
    triggerSuccessToast(`Database berhasil dikosongkan total (${deletedCount} record dihapus).`);
  };

  const handleResetToDefaultDatabase = () => {
    apiFetch('/api/database/reset', { method:'POST' }).catch(() => undefined);
    setStudents(INITIAL_STUDENTS);
    setAchievements(INITIAL_ACHIEVEMENTS);
    setSelectedSMAStudent(INITIAL_STUDENTS.find((s) => s.educationLevel === 'SMA') || null);
    setSelectedTalentStudent(INITIAL_STUDENTS[0] || null);

    logServerAction(
      'RESET_DATABASE',
      'Database Master dipulihkan ke 5 siswa default dan 6 rekam prestasi'
    );
    triggerSuccessToast('Database berhasil dipulihkan ke data standar bawaan sistem.');
  };

  const handleStartObservationForStudent = (student: StudentMasterRecord) => {
    const curriculum =
      student.educationLevel === 'PAUD'
        ? 'Kurikulum Merdeka (PAUD/Fase Fondasi)'
        : student.educationLevel === 'SD'
        ? 'Kurikulum Merdeka (SD/Fase A-C)'
        : student.educationLevel === 'SMP'
        ? 'Kurikulum Merdeka (SMP/Fase D)'
        : 'Kurikulum Merdeka (SMA/Fase E-F)';

    const newObs: ObservationData = {
      childMeta: {
        childName: student.fullName,
        ageYears: student.ageYears,
        ageMonths: student.ageMonths,
        gender: student.gender,
        observerName: currentUser.name,
        observerRole: currentUser.roleLabel,
        observationSetting: `Ruang Kelas ${student.educationLevel} (${student.gradeClass})`,
        observationDuration: '45 Menit',
        curriculumTarget: curriculum,
        focusNotes: student.specialNotes || 'Observasi reguler potensi dan gaya belajar siswa.',
      },
      selectedIndicators: ['cog_01', 'cog_03', 'sen_01', 'lan_01'],
      anecdotalNotes: `Siswa menunjukkan antusiasme belajar pada materi berbasis visual dan logika. NISN: ${student.nisn}. Wali murid: ${student.parentName}.`,
      mediaAttachments: [],
    };

    setObservationData(newObs);
    setSelectedCaseId(null);
    setActiveView('assessment');
    setActiveStep(1);
  };

  const handleViewAchievementsForStudent = (student: StudentMasterRecord) => {
    setAchievementStudentFilter(student.id);
    setActiveView('achievements');
  };

  const handleSelectSMAMajorForStudent = (student: StudentMasterRecord) => {
    setSelectedSMAStudent(student);
    setActiveView('sma_majors');
  };

  const handleSelectTalentForStudent = (student: StudentMasterRecord) => {
    setSelectedTalentStudent(student);
    setActiveView('talents');
  };

  // Achievement Operations
  const handleAddAchievement = (newAch: StudentAchievement) => {
    apiFetch('/api/database/achievements', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(newAch) }).catch(() => undefined);
    setAchievements([newAch, ...achievements]);
    setStudents(
      students.map((s) =>
        s.id === newAch.studentId
          ? { ...s, totalAchievements: (s.totalAchievements || 0) + 1 }
          : s
      )
    );
    logServerAction(
      'UPDATE_STUDENT',
      `Input Prestasi: ${newAch.studentName} - "${newAch.title}" (${newAch.rank}, ${newAch.category})`
    );
    triggerSuccessToast(`Prestasi "${newAch.title}" berhasil dicatat untuk ${newAch.studentName}.`);
  };

  const handleDeleteAchievement = (achId: string) => {
    const target = achievements.find((a) => a.id === achId);
    apiFetch(`/api/database/achievements/${achId}`, { method:'DELETE' }).catch(() => undefined);
    setAchievements(achievements.filter((a) => a.id !== achId));
    if (target) {
      setStudents(
        students.map((s) =>
          s.id === target.studentId
            ? { ...s, totalAchievements: Math.max(0, (s.totalAchievements || 1) - 1) }
            : s
        )
      );
      logServerAction(
        'DELETE_ACHIEVEMENT',
        `Hapus Prestasi: ${target.studentName} - "${target.title}"`
      );
    }
  };

  const handleGenerateCustomActivity = async (subjectArea: string, specificGoal: string) => {
    if (!analysisResult) return;
    setIsGeneratingActivity(true);

    try {
      const response = await fetch('/api/generate-custom-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childProfile: analysisResult,
          subjectArea,
          specificGoal,
        }),
      });

      let newAct;
      if (response.ok) {
        newAct = await response.json();
      } else {
        newAct = generateClientFallbackActivity(subjectArea, specificGoal, analysisResult.childMeta.childName);
      }

      setAnalysisResult({
        ...analysisResult,
        individualizedLearningPlan: {
          ...analysisResult.individualizedLearningPlan,
          microActivities: [
            ...(analysisResult.individualizedLearningPlan?.microActivities || []),
            newAct,
          ],
        },
      });
      triggerSuccessToast('Aktivitas kustom berhasil dirancang dan ditambahkan ke PPI.');
    } catch (err: any) {
      console.warn('Fallback activity generated due to:', err);
      const newAct = generateClientFallbackActivity(subjectArea, specificGoal, analysisResult.childMeta.childName);
      setAnalysisResult({
        ...analysisResult,
        individualizedLearningPlan: {
          ...analysisResult.individualizedLearningPlan,
          microActivities: [
            ...(analysisResult.individualizedLearningPlan?.microActivities || []),
            newAct,
          ],
        },
      });
      triggerSuccessToast('Aktivitas kustom berhasil dirancang dan ditambahkan ke PPI.');
    } finally {
      setIsGeneratingActivity(false);
    }
  };

  return (
    <div className="app-shell min-h-screen text-[#3D3B36] flex flex-col font-sans antialiased selection:bg-emerald-100 selection:text-[#0d5b44]">
      {/* Header */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        sampleCases={SAMPLE_CASES}
        selectedCaseId={selectedCaseId}
        onSelectCase={handleSelectCase}
        onReset={handleReset}
        onPrint={() => setIsPrintModalOpen(true)}
        onOpenGuide={() => setIsGuideModalOpen(true)}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        onOpenMasterControl={() => setIsServerModalOpen(true)}
        currentUser={currentUser}
        hasAnalysis={Boolean(analysisResult)}
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
        isChatOpen={isChatOpen}
      />

      {/* Main Content Area */}
      <main className="app-main flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Success Toast */}
        {successToast && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-between gap-3 text-emerald-900 text-xs sm:text-sm shadow-xs animate-fadeIn">
            <div className="flex items-center gap-2.5 font-semibold">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successToast}</span>
            </div>
            <button
              type="button"
              onClick={() => setSuccessToast(null)}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900"
            >
              Tutup
            </button>
          </div>
        )}

        {/* Error Toast */}
        {errorMessage && (
          <div className="p-4 bg-[#FDF6F4] border border-[#EACBBF] rounded-2xl flex items-center justify-between gap-3 text-[#9E4A38] text-xs sm:text-sm shadow-xs animate-fadeIn">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-[#C88E75] shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-xs font-bold underline hover:no-underline text-[#B86B50]"
            >
              Tutup
            </button>
          </div>
        )}

        {/* Global Loading Overlay */}
        {isLoading && (
          <div className="p-10 bg-white rounded-3xl border border-[#E5DFD1] shadow-sm flex flex-col items-center justify-center text-center space-y-4 max-w-xl mx-auto my-8">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-[#EBF3EE] border-t-[#2D5A43] animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center text-[#2D5A43]">
                <Brain className="w-7 h-7 animate-pulse" />
              </div>
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base sm:text-lg font-serif font-bold text-[#2A261F]">
                AI Neuropsikologi Sedang Menganalisis Observasi...
              </h3>
              <p className="text-xs text-[#8D887B] max-w-md leading-relaxed">
                Menyusun profil 6 domain perkembangan, interpretasi pedagogis, adaptasi kurikulum berdiferensiasi, dan Program Pembelajaran Individual (PPI).
              </p>
            </div>
          </div>
        )}

        {/* VIEW: Uji Coba Gratis */}
        {activeView === 'free_trial' && (
          <FreeTrialView
            currentUser={currentUser}
            onStartTrial={handleStartTrial}
            onNavigateToAssessment={() => setActiveView('assessment')}
          />
        )}

        {/* VIEW 1: Asesmen 5 Langkah Neuropsikologi & PPI */}
        {activeView === 'assessment' && !isLoading && (
          <>
            {activeStep === 1 && (
              <ObservationInput
                observationData={observationData}
                onChangeData={setObservationData}
                onAnalyze={(customPrompt) => runAnalysis(observationData, true, customPrompt)}
                isLoading={isLoading}
                onSelectSampleCase={(caseId) => {
                  const found = SAMPLE_CASES.find((c) => c.id === caseId);
                  if (found) handleSelectCase(found);
                }}
              />
            )}

            {activeStep === 2 && analysisResult && (
              <DevelopmentalProfile
                analysis={analysisResult}
                onNextStep={() => setActiveStep(3)}
              />
            )}

            {activeStep === 3 && analysisResult && (
              <PedagogicalInterpretation
                analysis={analysisResult}
                onNextStep={() => setActiveStep(4)}
              />
            )}

            {activeStep === 4 && analysisResult && (
              <CurriculumRecommendations
                analysis={analysisResult}
                onNextStep={() => setActiveStep(5)}
              />
            )}

            {activeStep === 5 && analysisResult && (
              <PersonalizedLearningPlan
                analysis={analysisResult}
                onPrint={() => setIsPrintModalOpen(true)}
                onGenerateCustomActivity={handleGenerateCustomActivity}
                isGeneratingActivity={isGeneratingActivity}
              />
            )}
          </>
        )}

        {/* VIEW 2: Database Input Siswa Baru */}
        {activeView === 'database' && (
          <StudentDatabaseView
            students={students}
            currentUser={currentUser}
            onAddStudent={handleAddStudent}
            onUpdateStudent={handleUpdateStudent}
            onDeleteStudent={handleDeleteStudent}
            onStartObservationForStudent={handleStartObservationForStudent}
            onViewAchievementsForStudent={handleViewAchievementsForStudent}
            onSelectSMAMajorForStudent={handleSelectSMAMajorForStudent}
            onSelectTalentForStudent={handleSelectTalentForStudent}
            onOpenMasterControl={() => setIsServerModalOpen(true)}
          />
        )}

        {/* VIEW 3: Menu Bakat Siswa (Multiple Intelligences) */}
        {activeView === 'talents' && (
          <TalentMappingView
            students={students}
            achievements={achievements}
            selectedStudent={selectedTalentStudent}
            onSelectStudent={setSelectedTalentStudent}
            currentUser={currentUser}
          />
        )}

        {/* VIEW 4: Menu Prestasi Anak */}
        {activeView === 'achievements' && (
          <StudentAchievementsView
            achievements={achievements}
            students={students}
            onAddAchievement={handleAddAchievement}
            onDeleteAchievement={handleDeleteAchievement}
            selectedStudentFilter={achievementStudentFilter}
            onClearStudentFilter={() => setAchievementStudentFilter(null)}
          />
        )}

        {/* VIEW 5: Bimbingan Karir & Peminatan Program Studi SMA */}
        {activeView === 'sma_majors' && (
          <SMAMajorSelectionView
            students={students}
            achievements={achievements}
            selectedStudent={selectedSMAStudent}
            onSelectStudent={setSelectedSMAStudent}
            neuroProfile={analysisResult}
          />
        )}

        {/* VIEW 6: Menu Login & Autentikasi Pengguna */}
        {activeView === 'curriculum_frameworks' && (
          <CurriculumFrameworksView onUse={(target) => { setObservationData(prev => ({...prev, childMeta:{...prev.childMeta, curriculumTarget:target}})); setActiveView('assessment'); setActiveStep(1); triggerSuccessToast(`Target kurikulum diubah ke ${target}.`); }} />
        )}

        {activeView === 'login' && (
          <LoginPortalView
            currentUser={currentUser}
            onSelectUser={setCurrentUser}
            onAuthenticate={handleAuthenticate}
            onRegister={handleRegister}
            onNavigateToAssessment={() => setActiveView('assessment')}
            onOpenMasterControl={() => setIsServerModalOpen(true)}
          />
        )}

        {/* VIEW 7: Program Kemitraan & Video Review Showcase */}
        {activeView === 'partnership' && (
          <PartnershipVideoReviewView
            onNavigateToAssessment={() => setActiveView('assessment')}
            onNavigateToDatabase={() => setActiveView('database')}
            onNavigateToTalents={() => setActiveView('talents')}
            onNavigateToMajors={() => setActiveView('sma_majors')}
          />
        )}
      </main>

      {/* Floating AI Consultation Chat Drawer */}
      <AIPedagogyChat
        analysis={analysisResult}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />

      {/* Printable / PDF Institutional Document View */}
      {isPrintModalOpen && analysisResult && (
        <ReportPrintView
          analysis={analysisResult}
          onClose={() => setIsPrintModalOpen(false)}
        />
      )}

      {/* Comprehensive Manual Guide PDF Modal */}
      <ManualGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />

      {/* Login & User Profile Modal with RBAC & Credentials Directory */}
      <LoginModal
        isOpen={isLoginModalOpen}
        currentUser={currentUser}
        onClose={() => setIsLoginModalOpen(false)}
        onSelectUser={setCurrentUser}
        onAuthenticate={handleAuthenticate}
        onRegister={handleRegister}
        onOpenMasterControl={() => setIsServerModalOpen(true)}
      />

      {/* Server Master Database & Audit Control Modal */}
      <ServerMasterDatabaseModal
        isOpen={isServerModalOpen}
        currentUser={currentUser}
        students={students}
        achievements={achievements}
        auditLogs={auditLogs}
        registeredUsers={registeredUsers}
        onClose={() => setIsServerModalOpen(false)}
        onRefreshUsers={refreshRegisteredUsers}
        onDeleteUser={handleDeleteUser}
        onPurgeUsers={handlePurgeUsers}
        onPurgeAllDatabase={handlePurgeAllDatabase}
        onResetToDefaultDatabase={handleResetToDefaultDatabase}
      />

      {/* Clean Natural Footer */}
      <footer className="bg-[#F2EDE4] border-t border-[#E5DFD1] py-6 text-center text-xs text-[#8D887B] mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-[#2A261F]">Aplikasi Kurikulum Berbasis Neuropsikologi</span>
            <span>•</span>
            <span>Platform Observasi Perkembangan Non-Diagnostik, Diferensiasi Pembelajaran & Portofolio Siswa</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-[#6B685F]">
            <ShieldCheck className="w-4 h-4 text-[#1E3A2F]" />
            <span>Sistem Hak Akses Berjenjang (Lembaga Maks. 3 Siswa, Server Review & Server Utama)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}


