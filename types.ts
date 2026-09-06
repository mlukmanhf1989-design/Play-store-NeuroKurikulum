export type ObservationDomainKey =
  | 'attention_executive'
  | 'motor_praxis'
  | 'communication_language'
  | 'social_emotional'
  | 'sensory_processing'
  | 'cognitive_play';

export interface ChildProfileMeta {
  childName: string;
  ageYears: number;
  ageMonths: number;
  gender: 'Laki-laki' | 'Perempuan' | 'Lainnya';
  observerName: string;
  observerRole:
    | 'Guru Kelas'
    | 'Guru Pendamping Khusus (GPK)'
    | 'Psikolog Pendidikan'
    | 'Konselor BK'
    | 'Orang Tua'
    | 'Terapis Perkembangan'
    | string;
  observationSetting:
    | 'Ruang Kelas PAUD/TK'
    | 'Ruang Kelas SD Awal'
    | 'Ruang Kelas SMP / SMA'
    | 'Area Bermain / Outdoor'
    | 'Rumah / Lingkungan Alami'
    | 'Sesi Observasi Terstruktur'
    | string;
  observationDuration: string;
  curriculumTarget:
    | 'Kurikulum Merdeka (PAUD/Fase Fondasi)'
    | 'Kurikulum Merdeka (Fase A/Kelas 1-2 SD)'
    | 'Kurikulum Merdeka (SD/Fase A-C)'
    | 'Kurikulum Merdeka (SMP/Fase D)'
    | 'Kurikulum Merdeka (SMA/Fase E-F)'
    | 'Pendekatan Montessori'
    | 'Reggio Emilia'
    | 'Kurikulum Inklusif / Adaptif'
    | string;
  focusNotes?: string;
}

export interface DomainCheckItem {
  id: string;
  label: string;
  description: string;
  category: ObservationDomainKey;
  selected: boolean;
}

export interface MediaAttachment {
  type: 'video' | 'audio' | 'image';
  name: string;
  size: string;
  dataUrl?: string;
  duration?: string;
  description?: string;
  isTrial?: boolean;
}

export interface ObservationData {
  childMeta: ChildProfileMeta;
  selectedIndicators: string[];
  anecdotalNotes: string;
  mediaAttachments: MediaAttachment[];
  recordedAudioSnippet?: string;
  recordedVideoSnippet?: string;
}

export interface DomainScoreResult {
  domain: ObservationDomainKey;
  domainLabel: string;
  score: number; // 0 - 100 relative developmental index
  summary: string;
  observedBehaviors: string[];
  recommendedSupport: string;
}

export interface PedagogicalImpact {
  instructionProcessing: string;
  physicalEnvironmentNeeds: string[];
  optimalFocusSpanMinutes: number;
  brainBreakIntervalMinutes: number;
  transitionStrategy: string;
  stressTriggers: string[];
  coRegulationTechniques: string[];
}

export interface CurriculumAdaptation {
  curriculumName: string;
  contentDifferentiation: string[];
  processDifferentiation: string[];
  productDifferentiation: string[];
  environmentDifferentiation: string[];
  recommendedMediaAndTools: {
    category: string;
    items: string[];
    usageGuidance: string;
  }[];
}

export interface LearningActivityDesign {
  title: string;
  targetDomain: string;
  duration: string;
  objective: string;
  materialsNeeded: string[];
  stepByStepInstructions: string[];
  scaffoldingTactics: string;
  sensoryIntegrationTip: string;
  parentTeacherTip: string;
}

export interface EvaluationRubricItem {
  indicator: string;
  emerging: string; // Mulai Berkembang
  progressing: string; // Berkembang Sesuai Harapan
  mastered: string; // Sangat Berkembang
}

export interface ComprehensiveAnalysisResult {
  id: string;
  timestamp: string;
  childMeta: ChildProfileMeta;
  nonDiagnosticDisclaimer: string;
  neurodevelopmentalStyle: {
    archetypeTitle: string;
    description: string;
    primaryLearningModality: 'Kinestetik-Proprioseptif' | 'Visual-Spasial' | 'Auditori-Sekuensial' | 'Multisensori Terstruktur' | 'Eksploratif Bebas';
    keyStrengths: string[];
    emergingSkills: string[];
    prioritySupportAreas: string[];
  };
  domainScores: DomainScoreResult[];
  pedagogicalImpact: PedagogicalImpact;
  curriculumAdaptations: CurriculumAdaptation;
  individualizedLearningPlan: {
    shortTermGoals: string[];
    longTermGoals: string[];
    microActivities: LearningActivityDesign[];
    dailyRoutineRecommendations: {
      timeframe: string;
      activityFocus: string;
      neuroSensoryStrategy: string;
    }[];
    evaluationRubric: EvaluationRubricItem[];
    parentCollabStrategies: string[];
  };
}

export interface SampleCase {
  id: string;
  title: string;
  ageText: string;
  summary: string;
  tag: string;
  data: ObservationData;
  cachedResult?: ComprehensiveAnalysisResult;
}

// User Authentication & Roles
export type UserRole =
  | 'superadmin' // Akun Server Utama (Root Administrator - Hapus Semua Database)
  | 'kurikulum' // Pengembang Kurikulum (Server Review & Hapus Data)
  | 'psikolog' // Psikolog Perkembangan / Klinis (Server Review & Hapus Data)
  | 'peneliti' // Peneliti Pendidikan & Neuropsikologi (Server Review & Hapus Data)
  | 'lembaga' // Lembaga Pendidikan (Dibatasi Maksimal 3 Siswa)
  | 'guru'
  | 'bk'
  | 'admin'
  | 'siswa'
  | 'orangtua';

export interface UserProfile {
  id: string;
  username: string;
  password?: string;
  name: string;
  email: string;
  role: UserRole;
  roleLabel: string;
  avatar: string;
  institutionName: string;
  joinedDate: string;
  studentLimit?: number; // 3 for 'lembaga', undefined / unlimited for server accounts
  canReviewAllAccounts?: boolean;
  canDeleteRecords?: boolean;
  canPurgeAllDatabase?: boolean;
  badgeColor?: string;
  description?: string;
}

export interface ServerAuditLog {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  actionType: 'DELETE_STUDENT' | 'PURGE_ALL_DATABASE' | 'RESET_DATABASE' | 'EXPORT_DATA' | 'UPDATE_STUDENT' | 'DELETE_ACHIEVEMENT';
  targetDetails: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
}

// Student Master Database
export type EducationLevel = 'PAUD' | 'SD' | 'SMP' | 'SMA';

export interface StudentMasterRecord {
  id: string;
  ownerId?: string;
  nisn: string;
  fullName: string;
  nickname: string;
  educationLevel: EducationLevel;
  gradeClass: string;
  gender: 'Laki-laki' | 'Perempuan';
  birthDate: string;
  ageYears: number;
  ageMonths: number;
  parentName: string;
  parentPhone: string;
  address: string;
  specialNotes?: string;
  createdAt: string;
  totalAchievements?: number;
  hasObservation?: boolean;
}

// Student Achievement Record
export type AchievementCategory =
  | 'Akademik / Sains'
  | 'Seni & Budaya'
  | 'Olahraga'
  | 'Teknologi & Robotika'
  | 'Keagamaan'
  | 'Kepemimpinan & Organisasi';

export type AchievementLevel =
  | 'Sekolah'
  | 'Kecamatan'
  | 'Kota/Kabupaten'
  | 'Provinsi'
  | 'Nasional'
  | 'Internasional';

export interface StudentAchievement {
  id: string;
  studentId: string;
  studentName: string;
  educationLevel: EducationLevel;
  gradeClass: string;
  title: string;
  category: AchievementCategory;
  level: AchievementLevel;
  rank: string; // e.g. "Juara 1", "Medali Emas", "Best Speaker"
  year: string;
  organizer: string;
  description: string;
  certificateUrl?: string;
  dateRecorded: string;
}

// SMA Major & Career Recommendation
export interface SMARecommendedMajor {
  majorName: string;
  faculty: string;
  matchScore: number; // 0 - 100
  cognitiveAlignmentReason: string;
  potentialCareers: string[];
  recommendedSubjectsToStrengthen: string[];
  topUniversitiesInIndonesia: string[];
}

export interface SMAMajorRecommendation {
  id: string;
  studentId: string;
  studentName: string;
  gradeClass: string;
  primaryInterests: string[];
  favoriteSubjects: string[];
  hobbiesAndPassion: string[];
  careerAspirations: string;
  learningStyleSynergy: string;
  topRecommendedMajors: SMARecommendedMajor[];
  actionPlanForSMA: string[];
  generatedAt: string;
}

// ==========================================
// TALENT MAPPING & MULTIPLE INTELLIGENCES TYPES
// ==========================================

export type TalentIntelligenceKey =
  | 'linguistic' // Kata & Bahasa
  | 'logical_math' // Logika & Angka
  | 'spatial_visual' // Ruang & Gambar
  | 'bodily_kinesthetic' // Tubuh & Gerak
  | 'musical' // Irama & Nada
  | 'interpersonal' // Hubungan & Sosial
  | 'intrapersonal' // Refleksi & Diri
  | 'naturalist' // Alam & Lingkungan
  | 'existential'; // Makna & Nilai Filosofis

export interface TalentDimensionMeta {
  key: TalentIntelligenceKey;
  name: string;
  alias: string;
  description: string;
  iconName: string;
  colorTheme: {
    bg: string;
    border: string;
    text: string;
    badge: string;
    bar: string;
    ring: string;
  };
  keyIndicators: string[];
  preferredActivities: string[];
  inspiringFigures: string[];
  recommendedLearningMedia: string[];
}

export interface TalentQuestionItem {
  id: string;
  dimensionKey: TalentIntelligenceKey;
  indicatorText: string;
  ageRelevance: 'Semua Jenjang' | 'PAUD/TK' | 'SD' | 'SMP/SMA';
}

export interface DominantTalentProfile {
  dimensionKey: TalentIntelligenceKey;
  dimensionName: string;
  score: number; // 0 - 100
  level: 'Sangat Dominan (Superior)' | 'Kuat & Menonjol' | 'Cukup Berkembang' | 'Perlu Stimulasi';
  strengthsDescription: string;
  observedBehaviors: string[];
}

export interface TalentAnalysisResult {
  id: string;
  studentId: string;
  studentName: string;
  educationLevel: EducationLevel;
  gradeClass: string;
  assessedDate: string;
  dimensionScores: Record<TalentIntelligenceKey, number>; // 0 - 100
  radarScores: { dimension: string; score: number; fullMark: number }[];
  overallSummary: string;
  dominantTalents: DominantTalentProfile[];
  secondaryTalents: DominantTalentProfile[];
  emergingHiddenTalents: string[];
  recommendedExtracurriculars: {
    name: string;
    category: string;
    rationale: string;
  }[];
  recommendedCompetitions: {
    title: string;
    level: string;
    preparationTip: string;
  }[];
  classroomStimulationStrategies: string[];
  homeStimulationStrategies: string[];
  futureCareerDirections: {
    field: string;
    exampleProfessions: string[];
  }[];
  nonDiagnosticDisclaimer: string;
}

