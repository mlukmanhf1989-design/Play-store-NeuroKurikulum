import {
  TalentDimensionMeta,
  TalentQuestionItem,
  TalentIntelligenceKey,
  TalentAnalysisResult,
  StudentMasterRecord,
} from '../types';

export const TALENT_DIMENSIONS: TalentDimensionMeta[] = [
  {
    key: 'logical_math',
    name: 'Logis - Matematis',
    alias: 'Kecerdasan Logika, Angka & Penalaran Kritis',
    description:
      'Kemampuan menganalisis masalah secara logis, mengenali pola abstrak, memecahkan teka-teki numerik, dan berpikir ilmiah induktif-deduktif.',
    iconName: 'Calculator',
    colorTheme: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      badge: 'bg-blue-100 text-blue-800 border-blue-300',
      bar: 'bg-blue-600',
      ring: 'focus:ring-blue-500',
    },
    keyIndicators: [
      'Cepat menangkap pola angka, rumus, dan hubungan sebab-akibat.',
      'Suka memecahkan teka-teki logika, catur, koding, dan strategi.',
      'Kritis bertanya "mengapa" dan menguji hipotesis secara sistematis.',
      'Menyukai kerapian urutan dan langkah-langkah kerja terstruktur.',
    ],
    preferredActivities: [
      'Eksperimen sains & coding algoritma',
      'Permainan strategi (Catur, Sudoku, Rubik)',
      'Olimpiade Sains (OSN Matematika/Fisika/Informatika)',
      'Eksplorasi data statistik dan grafik',
    ],
    inspiringFigures: ['B.J. Habibie', 'Alan Turing', 'Albert Einstein', 'Sri Mulyani'],
    recommendedLearningMedia: [
      'Alat peraga balok matematika & papan catur',
      'Scratch & Python visual programming',
      'Perangkat mikroskop & kit sains eksperimen',
    ],
  },
  {
    key: 'linguistic',
    name: 'Linguistik - Verbal',
    alias: 'Kecerdasan Bahasa, Kata & Komunikasi Naratif',
    description:
      'Kemampuan mengolah kata, menulis secara memikat, berpidato, berargumen logis, memahami nuansa sastra, dan menguasai bahasa asing.',
    iconName: 'BookOpen',
    colorTheme: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-800',
      badge: 'bg-amber-100 text-amber-800 border-amber-300',
      bar: 'bg-amber-600',
      ring: 'focus:ring-amber-500',
    },
    keyIndicators: [
      'Perbendaharaan kata kaya dan artikulasi berbicara lancar.',
      'Gemar membaca buku cerita, novel, artikel wawasan, atau puisi.',
      'Pandai berargumen, berpidato, bernegosiasi, atau bercerita (storytelling).',
      'Mudah menyerap kosakata bahasa asing baru.',
    ],
    preferredActivities: [
      'Klub Debat Bahasa Indonesia & LDBI / NSDC',
      'Menulis cerpen, esai opini, dan jurnalistik sekolah',
      'Public speaking, MC, pembawa acara, dan siniar (podcast)',
      'Membaca resensi buku & bedah sastra',
    ],
    inspiringFigures: ['Najwa Shihab', 'Pramoedya Ananta Toer', 'Chairil Anwar', 'Barack Obama'],
    recommendedLearningMedia: [
      'Buku ensiklopedia & novel berbobot',
      'Aplikasi rekaman podcast & video blogging',
      'Papan permainan Scrabble & kartu kuis diksi',
    ],
  },
  {
    key: 'spatial_visual',
    name: 'Spasial - Visual',
    alias: 'Kecerdasan Ruang, Desain, Gambar & Arsitektur',
    description:
      'Kemampuan membayangkan bentuk 3 dimensi, merancang tata letak, menggambar, mengapresiasi komposisi visual, dan membaca peta/denah.',
    iconName: 'Palette',
    colorTheme: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-800',
      badge: 'bg-purple-100 text-purple-800 border-purple-300',
      bar: 'bg-purple-600',
      ring: 'focus:ring-purple-500',
    },
    keyIndicators: [
      'Sangat peka terhadap warna, estetika tata letak, dan proporsi visual.',
      'Suka menggambar sketsa, melukis, membuat komik, atau desain grafis.',
      'Mudah membaca peta, denah ruang, origami, atau merakit maket 3D.',
      'Mengingat informasi lebih baik melalui bagan, infografis, dan video visual.',
    ],
    preferredActivities: [
      'Desain grafis (Canva, Figma, Photoshop, 3D Blender)',
      'Seni lukis, ilustrasi komik, dan fotografi kreatif',
      'Merancang maket arsitektur dan konstruksi lego bertingkat',
      'Animasi digital & videografi sinematik',
    ],
    inspiringFigures: ['Raden Saleh', 'Ridwan Kamil', 'Leonardo da Vinci', 'Hayao Miyazaki'],
    recommendedLearningMedia: [
      'Tablet gambar digital & drawing pen stylus',
      'Set cat air, akrilik, dan kanvas lukis',
      'Software CAD & aplikasi pemodelan 3 dimensi',
    ],
  },
  {
    key: 'bodily_kinesthetic',
    name: 'Kinestetik - Jasmani',
    alias: 'Kecerdasan Gerak Fisik, Olahraga & Ketangkasan Motorik',
    description:
      'Kemampuan mengendalikan gerakan tubuh dengan presisi, kelincahan atletik, koordinasi mata-tangan tinggi, dan ekspresi motorik halus/kasar.',
    iconName: 'Activity',
    colorTheme: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-800',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      bar: 'bg-emerald-600',
      ring: 'focus:ring-emerald-500',
    },
    keyIndicators: [
      'Memiliki stamina fisik, kelincahan gerak, dan koordinasi motorik unggul.',
      'Belajar paling cepat melalui demonstrasi praktik langsung (hands-on).',
      'Keahlian tangan terampil dalam memahat, menari, atau bongkar pasang mekanik.',
      'Ekspresif dalam bahasa tubuh, pantomim, atau seni teater/drama.',
    ],
    preferredActivities: [
      'Cabang Olahraga Prestasi (Bulu Tangkis, Basket, Futsal, Renang, Panahan)',
      'Seni Tari Tradisional & Modern Dance',
      'Bela Diri (Pencak Silat, Taekwondo, Karate)',
      'Kerajinan kriya, mekanik otomotif, atau bedah robotik',
    ],
    inspiringFigures: ['Taufik Hidayat', 'Greysia Polii', 'Didik Nini Thowok', 'Cristiano Ronaldo'],
    recommendedLearningMedia: [
      'Peralatan olahraga berstandar kejuaraan',
      'Kit prakarya kriya kayu/tanah liat & perkakas aman',
      'Tali skipping, agility ladder & matras olahraga',
    ],
  },
  {
    key: 'musical',
    name: 'Musikal - Ritmik',
    alias: 'Kecerdasan Nada, Irama, Harmoni & Pendengaran Musikal',
    description:
      'Kemampuan mengenali pitch nada, ritme ketukan, struktur melodi, menciptakan komposisi audio, serta memainkan alat musik dengan kepekaan telinga tinggi.',
    iconName: 'Music',
    colorTheme: {
      bg: 'bg-pink-50',
      border: 'border-pink-200',
      text: 'text-pink-800',
      badge: 'bg-pink-100 text-pink-800 border-pink-300',
      bar: 'bg-pink-600',
      ring: 'focus:ring-pink-500',
    },
    keyIndicators: [
      'Peka mengenali perubahan intonasi nada dan ketukan tempo suara.',
      'Cepat menghafal melodi lagu dan suka bersenandung atau mengetuk ritme.',
      'Mudah mempelajari instrumen musik (piano, gitar, biola, gamelan).',
      'Sering menggunakan musik untuk membangkitkan fokus dan mood belajar.',
    ],
    preferredActivities: [
      'Grup Band Sekolah, Orkes Simfoni & Paduan Suara (Vocal Group)',
      'Komposisi lagu digital & sound engineering (DAW)',
      'Lomba Menyanyi Solo FLS2N & festival musik daerah',
      'Belajar instrumen musik klasik atau kontemporer',
    ],
    inspiringFigures: ['Erwin Gutawa', 'Addie MS', 'Isyana Sarasvati', 'Ludwig van Beethoven'],
    recommendedLearningMedia: [
      'Keyboard/Piano elektrik berbobot & gitar akustik',
      'Software produksi audio (GarageBand / FL Studio)',
      'Metronom ritme & mikrofon rekaman berkualitas',
    ],
  },
  {
    key: 'interpersonal',
    name: 'Interpersonal - Sosial',
    alias: 'Kecerdasan Empati, Kepemimpinan & Hubungan Antar-Manusia',
    description:
      'Kemampuan memahami emosi dan motivasi orang lain, menjalin jejaring sosial, memimpin kelompok, memediasi konflik, dan berkolaborasi secara hangat.',
    iconName: 'Users',
    colorTheme: {
      bg: 'bg-teal-50',
      border: 'border-teal-200',
      text: 'text-teal-800',
      badge: 'bg-teal-100 text-teal-800 border-teal-300',
      bar: 'bg-teal-600',
      ring: 'focus:ring-teal-500',
    },
    keyIndicators: [
      'Mudah berteman, disukai rekan sebaya, dan memiliki empati emosional tinggi.',
      'Kerap dipercaya sebagai ketua kelas, koordinator tim, atau mediator musyawarah.',
      'Peka menangkap perasaan dan bahasa tubuh orang di sekitarnya.',
      'Senang berdiskusi kelompok dan membantu teman yang mengalami kesulitan.',
    ],
    preferredActivities: [
      'Organisasi Siswa Intra Sekolah (OSIS) & Majelis Perwakilan Kelas (MPK)',
      'Gerakan Pramuka, Palang Merah Remaja (PMR), dan Relawan Sosial',
      'Proyek Penguatan Profil Pelajar Pancasila (P5) berbasis pengabdian',
      'Program Duta Sekolah, Hubungan Masyarakat & Forum Anak',
    ],
    inspiringFigures: ['Ki Hajar Dewantara', 'Nelson Mandela', 'Ibu Teresa', 'Bung Karno'],
    recommendedLearningMedia: [
      'Buku studi kasus dinamika kepemimpinan & empati',
      'Simulasi debat sidang PBB (Model UN)',
      'Permainan papan kooperatif (Co-op board games)',
    ],
  },
  {
    key: 'intrapersonal',
    name: 'Intrapersonal - Reflektif',
    alias: 'Kecerdasan Refleksi Diri, Regulasi Emosi & Kemandirian',
    description:
      'Kemampuan memahami diri sendiri secara mendalam, mengenali kekuatan dan kelemahan pribadi, menetapkan tujuan hidup mandiri, dan memiliki disiplin internal kuat.',
    iconName: 'Compass',
    colorTheme: {
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
      text: 'text-indigo-800',
      badge: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      bar: 'bg-indigo-600',
      ring: 'focus:ring-indigo-500',
    },
    keyIndicators: [
      'Memiliki kesadaran diri (self-awareness) tinggi dan tahu apa yang disukai/dikuasai.',
      'Dapat bekerja mandiri tanpa perlu diawasi terus-menerus (self-directed learner).',
      'Sering merenung, menulis buku harian (journaling), dan mengevaluasi kemajuan diri.',
      'Memiliki prinsip hidup teguh dan motivasi berprestasi dari dalam diri (intrinsik).',
    ],
    preferredActivities: [
      'Menulis jurnal refleksi harian & target pencapaian pribadi (goal setting)',
      'Riset mandiri topik minat khusus (independent research project)',
      'Mindfulness, meditasi fokus, dan refleksi filosofis',
      'Membaca biografi tokoh dunia untuk introspeksi diri',
    ],
    inspiringFigures: ['Buya Hamka', 'R.A. Kartini', 'Marcus Aurelius', 'Socrates'],
    recommendedLearningMedia: [
      'Jurnal agenda bersampul tebal untuk refleksi berkala',
      'Buku pengembangan diri & psikologi populer anak/remaja',
      'Timer pomodoro untuk manajemen waktu mandiri',
    ],
  },
  {
    key: 'naturalist',
    name: 'Naturalis - Ekologis',
    alias: 'Kecerdasan Alam, Flora, Fauna & Konservasi Lingkungan',
    description:
      'Kemampuan mengenali spesies tumbuhan dan hewan, memahami siklus ekosistem alam, peka terhadap kelestarian lingkungan, dan senang berkegiatan di alam bebas.',
    iconName: 'Leaf',
    colorTheme: {
      bg: 'bg-lime-50',
      border: 'border-lime-200',
      text: 'text-lime-800',
      badge: 'bg-lime-100 text-lime-800 border-lime-300',
      bar: 'bg-lime-600',
      ring: 'focus:ring-lime-500',
    },
    keyIndicators: [
      'Tertarik pada hewan peliharaan, tanaman kebun, batuan, dan fenomena cuaca.',
      'Sangat teliti mengklasifikasikan spesies hayati dan ciri-ciri makhluk hidup.',
      'Peduli pada isu daur ulang sampah, penghijauan, dan konservasi alam.',
      'Menikmati kegiatan outdoor, berkebun, berkemah, dan observasi alam.',
    ],
    preferredActivities: [
      'Klub Pecinta Alam (Sispala) & Ekstrakurikuler Kelompok Ilmiah Remaja (KIR Hayati)',
      'Proyek Kebun Hidroponik Sekolah & Komposting Organik',
      'Olimpiade Sains Biologi & Kebumian / Geografi',
      'Kunjungan konservasi satwa, taman nasional, dan ekspedisi alam',
    ],
    inspiringFigures: ['Charles Darwin', 'Jane Goodall', 'Alexander von Humboldt', 'Dr. Emil Salim'],
    recommendedLearningMedia: [
      'Teropong binokular burung & kaca pembesar lapangan',
      'Kit budidaya tanaman mini / terrarium',
      'Buku panduan lapangan identifikasi burung & flora Indonesia',
    ],
  },
  {
    key: 'existential',
    name: 'Eksistensial - Filosofis',
    alias: 'Kecerdasan Makna Hidup, Etika, Spiritualitas & Nilai Luhur',
    description:
      'Kemampuan memikirkan pertanyaan mendasar tentang arti kehidupan, keadilan sosial, moralitas, spiritualitas mendalam, dan warisan kebaikan bagi sesama.',
    iconName: 'Sparkles',
    colorTheme: {
      bg: 'bg-amber-50',
      border: 'border-amber-300',
      text: 'text-amber-900',
      badge: 'bg-amber-100 text-amber-900 border-amber-400',
      bar: 'bg-amber-700',
      ring: 'focus:ring-amber-600',
    },
    keyIndicators: [
      'Kerap merenungkan tujuan hidup, nilai kebenaran, dan keadilan moral.',
      'Memiliki penghayatan spiritual dan kepekaan religius yang tulus.',
      'Tertarik pada sejarah peradaban besar, filsafat nilai, dan dampak sosial bagi kemanusiaan.',
      'Berkomitmen pada prinsip integritas dan etika yang kuat dalam bertindak.',
    ],
    preferredActivities: [
      'Forum Diskusi Filsafat Etika & Kajian Nilai Moral Keagamaan',
      'Gerakan Sosial Kemanusiaan & Advokasi Keadilan Lingkungan',
      'Kajian Sejarah Peradaban Bangsa & Budaya Nusantara',
      'Kegiatan bakti sosial dan dialog lintas budaya',
    ],
    inspiringFigures: ['K.H. Abdurrahman Wahid (Gus Dur)', 'Bung Hatta', 'Mahatma Gandhi', 'Immanuel Kant'],
    recommendedLearningMedia: [
      'Buku hikmah filosofis dan biografi tokoh pahlawan bangsa',
      'Dokumenter peradaban sejarah dunia',
      'Modul etika terapan dan dialog toleransi',
    ],
  },
];

// 24 Observational Questionnaire items (3 items per main intelligence dimension)
export const TALENT_QUESTIONNAIRE_ITEMS: TalentQuestionItem[] = [
  // Logical-Math
  {
    id: 'q_log_1',
    dimensionKey: 'logical_math',
    indicatorText: 'Cepat memahami rumus, pola urutan angka, tabel data, atau hubungan logika sebab-akibat.',
    ageRelevance: 'Semua Jenjang',
  },
  {
    id: 'q_log_2',
    dimensionKey: 'logical_math',
    indicatorText: 'Menyukai permainan asah otak, catur, puzzle logika, teka-teki berhitung, atau koding komputer.',
    ageRelevance: 'Semua Jenjang',
  },
  {
    id: 'q_log_3',
    dimensionKey: 'logical_math',
    indicatorText: 'Sering mengajukan pertanyaan kritis berbasis fakta dan ingin menguji kebenaran secara terstruktur.',
    ageRelevance: 'Semua Jenjang',
  },

  // Linguistic
  {
    id: 'q_lin_1',
    dimensionKey: 'linguistic',
    indicatorText: 'Mampu menyusun kalimat berbicara atau tulisan secara kaya, runtut, dan persuasif memikat.',
    ageRelevance: 'Semua Jenjang',
  },
  {
    id: 'q_lin_2',
    dimensionKey: 'linguistic',
    indicatorText: 'Gemar membaca buku, menyimak cerita, membuat puisi/cerpen, atau berdiskusi topik wawasan.',
    ageRelevance: 'Semua Jenjang',
  },
  {
    id: 'q_lin_3',
    dimensionKey: 'linguistic',
    indicatorText: 'Percaya diri berbicara di depan umum (presentasi, berpidato, bercerita, debat, atau menjadi MC).',
    ageRelevance: 'Semua Jenjang',
  },

  // Spatial-Visual
  {
    id: 'q_spa_1',
    dimensionKey: 'spatial_visual',
    indicatorText: 'Sangat terampil menggambar sketsa, melukis, membuat desain grafis, animasi, atau karya visual estetis.',
    ageRelevance: 'Semua Jenjang',
  },
  {
    id: 'q_spa_2',
    dimensionKey: 'spatial_visual',
    indicatorText: 'Mudah membayangkan bentuk ruang 3D, membaca denah/peta, merakit balok origami/lego arsitektur.',
    ageRelevance: 'Semua Jenjang',
  },
  {
    id: 'q_spa_3',
    dimensionKey: 'spatial_visual',
    indicatorText: 'Lebih mudah menyerap materi pelajaran jika disajikan dalam bentuk diagram warna, bagan alur, atau video.',
    ageRelevance: 'Semua Jenjang',
  },

  // Kinesthetic
  {
    id: 'q_kin_1',
    dimensionKey: 'bodily_kinesthetic',
    indicatorText: 'Memiliki kelincahan fisik, ketangkasan olahraga, kebugaran atletik, atau koordinasi gerak tari yang lentur.',
    ageRelevance: 'Semua Jenjang',
  },
  {
    id: 'q_kin_2',
    dimensionKey: 'bodily_kinesthetic',
    indicatorText: 'Belajar paling efektif saat melakukan praktik tangan langsung (hands-on) atau bergerak aktif.',
    ageRelevance: 'Semua Jenjang',
  },
  {
    id: 'q_kin_3',
    dimensionKey: 'bodily_kinesthetic',
    indicatorText: 'Terampil menggunakan alat pertukangan tangan, bongkar pasang mekanik, kriya, atau bahasa tubuh ekspresif.',
    ageRelevance: 'Semua Jenjang',
  },

  // Musical
  {
    id: 'q_mus_1',
    dimensionKey: 'musical',
    indicatorText: 'Peka membedakan nada fals, ketukan tempo ritme, dan memiliki pendengaran musikal yang tajam.',
    ageRelevance: 'Semua Jenjang',
  },
  {
    id: 'q_mus_2',
    dimensionKey: 'musical',
    indicatorText: 'Cepat menghafal nada melodi lagu baru, suka bersenandung, atau memainkan instrumen musik.',
    ageRelevance: 'Semua Jenjang',
  },
  {
    id: 'q_mus_3',
    dimensionKey: 'musical',
    indicatorText: 'Mampu mengekspresikan suasana hati atau menciptakan variasi irama musik secara kreatif.',
    ageRelevance: 'Semua Jenjang',
  },

  // Interpersonal
  {
    id: 'q_int_1',
    dimensionKey: 'interpersonal',
    indicatorText: 'Mudah bergaul, hangat menjalin persahabatan baru, dan disukai banyak teman di lingkungan sekolah.',
    ageRelevance: 'Semua Jenjang',
  },
  {
    id: 'q_int_2',
    dimensionKey: 'interpersonal',
    indicatorText: 'Memiliki bakat kepemimpinan alami, mampu memandu kerja kelompok, dan mendamaikan perselisihan teman.',
    ageRelevance: 'Semua Jenjang',
  },
  {
    id: 'q_int_3',
    dimensionKey: 'interpersonal',
    indicatorText: 'Peka merasakan perasaan orang lain (empati tinggi) dan senang membantu teman yang sedang kesusahan.',
    ageRelevance: 'Semua Jenjang',
  },

  // Intrapersonal
  {
    id: 'q_inp_1',
    dimensionKey: 'intrapersonal',
    indicatorText: 'Mengetahui kelebihan dan kekurangan diri sendiri serta memiliki motivasi belajar mandiri yang tinggi.',
    ageRelevance: 'Semua Jenjang',
  },
  {
    id: 'q_inp_2',
    dimensionKey: 'intrapersonal',
    indicatorText: 'Mampu mengendalikan emosi dengan bijak dan senang merenung atau menulis jurnal refleksi pribadi.',
    ageRelevance: 'Semua Jenjang',
  },
  {
    id: 'q_inp_3',
    dimensionKey: 'intrapersonal',
    indicatorText: 'Mandiri dalam menyelesaikan tugas tanpa harus selalu disuruh atau diawasi secara ketat.',
    ageRelevance: 'Semua Jenjang',
  },

  // Naturalist
  {
    id: 'q_nat_1',
    dimensionKey: 'naturalist',
    indicatorText: 'Sangat menyayangi hewan peliharaan, tertarik merawat tanaman hias/kebun, atau mengamati alam bebas.',
    ageRelevance: 'Semua Jenjang',
  },
  {
    id: 'q_nat_2',
    dimensionKey: 'naturalist',
    indicatorText: 'Cepat mengenali dan mengklasifikasikan jenis tumbuhan, bebatuan, serangga, atau fenomena cuaca.',
    ageRelevance: 'Semua Jenjang',
  },
  {
    id: 'q_nat_3',
    dimensionKey: 'naturalist',
    indicatorText: 'Memiliki kepedulian tinggi terhadap kebersihan lingkungan, daur ulang sampah, dan kelestarian bumi.',
    ageRelevance: 'Semua Jenjang',
  },
];

// Initial preset talent analyses for immediate rich experience
export const INITIAL_TALENT_ANALYSES: Record<string, TalentAnalysisResult> = {
  'std-sma-1': {
    id: 'tal-farhan-01',
    studentId: 'std-sma-1',
    studentName: 'Muhammad Farhan Al-Ghifari',
    educationLevel: 'SMA',
    gradeClass: 'XII IPA 1',
    assessedDate: '2025-02-15',
    dimensionScores: {
      logical_math: 95,
      spatial_visual: 88,
      intrapersonal: 84,
      linguistic: 72,
      interpersonal: 68,
      bodily_kinesthetic: 62,
      naturalist: 60,
      musical: 55,
      existential: 75,
    },
    radarScores: [
      { dimension: 'Logis-Matematis', score: 95, fullMark: 100 },
      { dimension: 'Spasial-Visual', score: 88, fullMark: 100 },
      { dimension: 'Intrapersonal', score: 84, fullMark: 100 },
      { dimension: 'Linguistik', score: 72, fullMark: 100 },
      { dimension: 'Interpersonal', score: 68, fullMark: 100 },
      { dimension: 'Kinestetik', score: 62, fullMark: 100 },
      { dimension: 'Naturalis', score: 60, fullMark: 100 },
      { dimension: 'Musikal', score: 55, fullMark: 100 },
    ],
    overallSummary:
      'Farhan memiliki profil kecerdasan komputasional dan penalaran analitis tingkat tinggi (Superior Logic & Visual Architecture). Ia mampu memecahkan persoalan sistemik yang kompleks, merancang arsitektur perangkat lunak, dan memiliki fokus kemandirian riset yang sangat tekun.',
    dominantTalents: [
      {
        dimensionKey: 'logical_math',
        dimensionName: 'Logis - Matematis',
        score: 95,
        level: 'Sangat Dominan (Superior)',
        strengthsDescription:
          'Keahlian penalaran algoritma, dekomposisi logika matematika, dan sintesis pemecahan masalah teknis.',
        observedBehaviors: [
          'Memprogram algoritma otomasi dan robotika secara mandiri',
          'Sangat cepat memahami kalkulus, matriks, dan struktur data abstrak',
          'Mampu melokalisasi bug logika dan menyusun skema optimasi sistem',
        ],
      },
      {
        dimensionKey: 'spatial_visual',
        dimensionName: 'Spasial - Visual',
        score: 88,
        level: 'Kuat & Menonjol',
        strengthsDescription:
          'Kemampuan memvisualisasikan arsitektur sistem informasi, topologi jaringan, dan antarmuka interaktif.',
        observedBehaviors: [
          'Merancang diagram alir data (DFD) dan prototipe aplikasi secara elegan',
          'Membayangkan perakitan modul mikrokontroler dalam ruang 3 dimensi',
        ],
      },
      {
        dimensionKey: 'intrapersonal',
        dimensionName: 'Intrapersonal - Reflektif',
        score: 84,
        level: 'Kuat & Menonjol',
        strengthsDescription:
          'Daya juang riset mandiri, kemampuan regulasi waktu belajar terarah, dan evaluasi hasil secara objektif.',
        observedBehaviors: [
          'Mempelajari teknologi pemrograman baru secara otodidak melalui dokumentasi resmi',
          'Disiplin dalam menyelesaikan proyek sains hingga tahap implementasi akhir',
        ],
      },
    ],
    secondaryTalents: [
      {
        dimensionKey: 'linguistic',
        dimensionName: 'Linguistik - Verbal',
        score: 72,
        level: 'Cukup Berkembang',
        strengthsDescription:
          'Mampu mendokumentasikan laporan teknis ilmiah dalam bahasa Indonesia dan bahasa Inggris dengan terstruktur.',
        observedBehaviors: ['Menulis makalah penelitian sains dan presentasi ilmiah di hadapan dewan juri'],
      },
    ],
    emergingHiddenTalents: [
      'Kepemimpinan Teknis (Engineering Leadership): Berpotensi menjadi Tech Lead proyek dengan membina anggota tim junior.',
    ],
    recommendedExtracurriculars: [
      {
        name: 'Klub Olimpiade Sains Komputer & Informatika',
        category: 'Akademik & Riset',
        rationale: 'Mengasah kemampuan algoritma pemrograman kompetitif dan persiapan OSN/IOI tingkat nasional.',
      },
      {
        name: 'Komunitas Robotika & IoT Terapan',
        category: 'Teknologi Terapan',
        rationale: 'Mengintegrasikan perancangan perangkat keras dengan logika kecerdasan buatan.',
      },
    ],
    recommendedCompetitions: [
      {
        title: 'Olimpiade Sains Nasional (OSN) Bidang Informatika / Komputer',
        level: 'Tingkat Provinsi hingga Nasional (Puspresnas)',
        preparationTip: 'Perbanyak latihan problem-solving graf, dynamic programming, dan simulasi waktu nyata.',
      },
      {
        title: 'Lomba Cipta Aplikasi AI & Hackathon Pelajar SMA',
        level: 'Tingkat Nasional / Universitas',
        preparationTip: 'Bangun portofolio produk nyata yang menyelesaikan persoalan lingkungan atau pendidikan.',
      },
    ],
    classroomStimulationStrategies: [
      'Berikan peran sebagai fasilitator sebaya (peer tutor) dalam materi logika informatika atau matematika tingkat lanjut.',
      'Sediakan tugas proyek terbuka (open-ended problem) yang menuntut perancangan sistem nyata bukan sekadar hafalan teori.',
      'Dorong keikutsertaan dalam seminar ilmiah dan pembimbingan riset karya tulis.',
    ],
    homeStimulationStrategies: [
      'Fasilitasi akses internet stabil, kursus sertifikasi koding/AI, dan buku-buku referensi teknik terkini.',
      'Ajak berdiskusi tentang penerapan teknologi dalam memecahkan masalah ekonomi dan sosial di masyarakat.',
      'Jaga keseimbangan aktivitas fisik dan sosialisasi agar tidak terpaku terlalu lama di depan layar komputer.',
    ],
    futureCareerDirections: [
      {
        field: 'Software Engineering & Artificial Intelligence',
        exampleProfessions: ['AI/Machine Learning Engineer', 'Cloud Architect', 'Cybersecurity Specialist'],
      },
      {
        field: 'Computer Science Research & Academia',
        exampleProfessions: ['Ilmuwan Komputer', 'Dosen/Peneliti Teknologi Informasi', 'Tech Startup Founder'],
      },
    ],
    nonDiagnosticDisclaimer:
      'Laporan Pemetaan Bakat ini disusun berbasis observasi pedagogis dan indikator Multiple Intelligences Gardner untuk keperluan pengembangan potensi belajar, bukan merupakan asesmen klinis.',
  },
  'std-sma-2': {
    id: 'tal-aisyah-02',
    studentId: 'std-sma-2',
    studentName: 'Aisyah Putri Maharani',
    educationLevel: 'SMA',
    gradeClass: 'XI IPS 2',
    assessedDate: '2025-02-10',
    dimensionScores: {
      linguistic: 96,
      interpersonal: 92,
      existential: 88,
      intrapersonal: 82,
      logical_math: 75,
      spatial_visual: 68,
      musical: 65,
      bodily_kinesthetic: 58,
      naturalist: 60,
    },
    radarScores: [
      { dimension: 'Linguistik', score: 96, fullMark: 100 },
      { dimension: 'Interpersonal', score: 92, fullMark: 100 },
      { dimension: 'Eksistensial', score: 88, fullMark: 100 },
      { dimension: 'Intrapersonal', score: 82, fullMark: 100 },
      { dimension: 'Logis-Matematis', score: 75, fullMark: 100 },
      { dimension: 'Spasial-Visual', score: 68, fullMark: 100 },
      { dimension: 'Musikal', score: 65, fullMark: 100 },
      { dimension: 'Kinestetik', score: 58, fullMark: 100 },
    ],
    overallSummary:
      'Aisyah memiliki kecerdasan retorika, diplomasi, dan empati sosial yang sangat luar biasa (High Verbal Eloquence & Diplomatic Leadership). Ia memiliki daya persuasi tinggi, mampu mencairkan suasana musyawarah, dan peka terhadap isu keadilan sosial serta hubungan internasional.',
    dominantTalents: [
      {
        dimensionKey: 'linguistic',
        dimensionName: 'Linguistik - Verbal',
        score: 96,
        level: 'Sangat Dominan (Superior)',
        strengthsDescription:
          'Keahlian public speaking, artikulasi bahasa Indonesia dan Inggris yang fasih, serta penyusunan argumen terstruktur.',
        observedBehaviors: [
          'Juara Best Speaker dalam lomba debat bahasa Inggris',
          'Mampu menulis esai analisis opini hukum dengan sudut pandang berimbang',
          'Sangat persuasif dalam menyampaikan ide dan presentasi',
        ],
      },
      {
        dimensionKey: 'interpersonal',
        dimensionName: 'Interpersonal - Sosial',
        score: 92,
        level: 'Sangat Dominan (Superior)',
        strengthsDescription:
          'Kemampuan membangun jejaring, memimpin organisasi dengan pendekatan dialogis, dan memediasi perbedaan pendapat.',
        observedBehaviors: [
          'Aktif sebagai pengurus inti OSIS dan mengoordinasikan kegiatan sekolah dengan lancar',
          'Cepat membaca dinamika emosi kelompok dan memberikan solusi kompromi yang memuaskan',
        ],
      },
      {
        dimensionKey: 'existential',
        dimensionName: 'Eksistensial - Filosofis',
        score: 88,
        level: 'Kuat & Menonjol',
        strengthsDescription:
          'Ketertarikan mendalam pada nilai-nilai kemanusiaan, hukum tata negara, dan etika hubungan antar-bangsa.',
        observedBehaviors: [
          'Kerap memprakarsai kegiatan aksi kepedulian sosial dan advokasi literasi anak pedalaman',
        ],
      },
    ],
    secondaryTalents: [
      {
        dimensionKey: 'intrapersonal',
        dimensionName: 'Intrapersonal - Reflektif',
        score: 82,
        level: 'Kuat & Menonjol',
        strengthsDescription: 'Refleksi etis yang kuat dan integritas diri yang konsisten.',
        observedBehaviors: ['Menjunjung tinggi prinsip kejujuran dalam berorganisasi'],
      },
    ],
    emergingHiddenTalents: [
      'Negosiasi & Diplomasi Multilateral: Berbakat memimpin delegasi dalam simulasi sidang Model United Nations (MUN).',
    ],
    recommendedExtracurriculars: [
      {
        name: 'English Debating Society & Model UN Club',
        category: 'Bahasa & Kepemimpinan Global',
        rationale: 'Mengasah wawasan hubungan internasional, retorika kritis, dan diplomasi antar-negara.',
      },
      {
        name: 'OSIS & Majelis Perwakilan Kelas (MPK)',
        category: 'Organisasi Sekolah',
        rationale: 'Mematangkan kapabilitas manajemen kebijakan publik dan komunikasi publik.',
      },
    ],
    recommendedCompetitions: [
      {
        title: 'National Schools Debating Championship (NSDC) & LDBI',
        level: 'Tingkat Nasional (Kemendikbudristek)',
        preparationTip: 'Perdalam studi kasus geopolitik kontemporer, hukum lingkungan, dan ekonomi makro.',
      },
      {
        title: 'Lomba Karya Tulis Esai Kritis & Orasi Kebangsaan',
        level: 'Tingkat Nasional',
        preparationTip: 'Asah sintesis argumen dengan referensi jurnal hukum dan data empiris terpercaya.',
      },
    ],
    classroomStimulationStrategies: [
      'Beri ruang untuk memimpin diskusi panel kelas dan sesi debat terstruktur.',
      'Libatkan dalam penyusunan resolusi proyek P5 terkait tema kebinekaan dan kearifan lokal.',
      'Dukung pemanfaatan media literasi digital untuk mempublikasikan artikel opini positif.',
    ],
    homeStimulationStrategies: [
      'Ajak berdiskusi tentang berita dunia, dinamika kebijakan publik, dan isu hukum di meja makan.',
      'Dukung partisipasi dalam forum kepemudaan dan pertukaran pelajar internasional.',
      'Beri apresiasi pada konsistensi kepedulian sosial dan keteguhan integritasnya.',
    ],
    futureCareerDirections: [
      {
        field: 'Law & International Relations',
        exampleProfessions: ['Diplomat Internasional', 'Praktisi Hukum / Advokat Korporasi', 'Spesialis Kebijakan Publik'],
      },
      {
        field: 'Communication & Media',
        exampleProfessions: ['Jurnalis Investigasi', 'Public Relations Director', 'Konsultan Komunikasi Strategis'],
      },
    ],
    nonDiagnosticDisclaimer:
      'Laporan Pemetaan Bakat ini disusun berbasis observasi pedagogis dan indikator Multiple Intelligences Gardner untuk memfasilitasi arahan karir dan pengembangan potensi diri anak.',
  },
};

// Generates fallback full Talent Analysis from calculated dimension scores
export function generateFallbackTalentAnalysis(
  student: StudentMasterRecord,
  scores: Record<TalentIntelligenceKey, number>,
  additionalNotes?: string
): TalentAnalysisResult {
  const sortedKeys = (Object.keys(scores) as TalentIntelligenceKey[]).sort(
    (a, b) => scores[b] - scores[a]
  );

  const getDimensionMeta = (key: TalentIntelligenceKey) =>
    TALENT_DIMENSIONS.find((d) => d.key === key) || TALENT_DIMENSIONS[0];

  const top3Keys = sortedKeys.slice(0, 3);
  const secondaryKey = sortedKeys[3];

  const dominantTalents = top3Keys.map((key) => {
    const meta = getDimensionMeta(key);
    const sc = scores[key];
    const level =
      sc >= 85
        ? ('Sangat Dominan (Superior)' as const)
        : sc >= 70
        ? ('Kuat & Menonjol' as const)
        : sc >= 55
        ? ('Cukup Berkembang' as const)
        : ('Perlu Stimulasi' as const);

    return {
      dimensionKey: key,
      dimensionName: meta.name,
      score: sc,
      level,
      strengthsDescription: meta.description,
      observedBehaviors: meta.keyIndicators.slice(0, 2),
    };
  });

  const secondaryMeta = getDimensionMeta(secondaryKey);
  const secondaryTalents = [
    {
      dimensionKey: secondaryKey,
      dimensionName: secondaryMeta.name,
      score: scores[secondaryKey],
      level:
        scores[secondaryKey] >= 70
          ? ('Kuat & Menonjol' as const)
          : ('Cukup Berkembang' as const),
      strengthsDescription: secondaryMeta.description,
      observedBehaviors: secondaryMeta.keyIndicators.slice(0, 2),
    },
  ];

  const top1 = getDimensionMeta(top3Keys[0]);
  const top2 = getDimensionMeta(top3Keys[1]);

  const radarScores = [
    { dimension: 'Logis-Matematika', score: scores.logical_math || 50, fullMark: 100 },
    { dimension: 'Linguistik-Kata', score: scores.linguistic || 50, fullMark: 100 },
    { dimension: 'Spasial-Visual', score: scores.spatial_visual || 50, fullMark: 100 },
    { dimension: 'Kinestetik-Gerak', score: scores.bodily_kinesthetic || 50, fullMark: 100 },
    { dimension: 'Musikal-Irama', score: scores.musical || 50, fullMark: 100 },
    { dimension: 'Interpersonal', score: scores.interpersonal || 50, fullMark: 100 },
    { dimension: 'Intrapersonal', score: scores.intrapersonal || 50, fullMark: 100 },
    { dimension: 'Naturalis-Alam', score: scores.naturalist || 50, fullMark: 100 },
  ];

  return {
    id: `tal-${student.id}-${Date.now()}`,
    studentId: student.id,
    studentName: student.fullName,
    educationLevel: student.educationLevel,
    gradeClass: student.gradeClass,
    assessedDate: new Date().toISOString().split('T')[0],
    dimensionScores: scores,
    radarScores,
    overallSummary: `${student.fullName} menunjukkan kekuatan bakat yang sangat menonjol pada domain ${top1.name} dan ${top2.name}. Profil ini merefleksikan kecenderungan belajar aktif dan daya kreasi yang tinggi bila difasilitasi dengan media pembelajaran yang relevan.`,
    dominantTalents,
    secondaryTalents,
    emergingHiddenTalents: [
      `Kombinasi ${top1.name} dengan ${top2.name} membuka peluang kreasi multidisipliner dan kepemimpinan proyek.`,
    ],
    recommendedExtracurriculars: top1.preferredActivities.slice(0, 2).map((act, idx) => ({
      name: act,
      category: idx === 0 ? 'Pengembangan Bakat Utama' : 'Eksplorasi Kreatif',
      rationale: `Mengasah modalitas ${top1.name} secara berjenjang dan terarah.`,
    })),
    recommendedCompetitions: [
      {
        title: `Ajang Prestasi Bidang ${top1.name}`,
        level: student.educationLevel === 'SMA' ? 'Tingkat Kabupaten hingga Nasional' : 'Tingkat Sekolah hingga Kota',
        preparationTip: `Fokus pada portofolio karya nyata dan pembinaan intensif bersama guru pendamping.`,
      },
    ],
    classroomStimulationStrategies: [
      `Gunakan pendekatan diferensiasi proses berbasis media ${top1.name}.`,
      `Berikan kesempatan unjuk karya (diferensiasi produk) yang sesuai dengan minat alaminya.`,
      `Pasangkan dalam kelompok kooperatif untuk menyeimbangkan peran bakat.`,
    ],
    homeStimulationStrategies: [
      `Sediakan ruang dan media eksplorasi di rumah sesuai minat ${top1.name}.`,
      `Dampingi anak mengeksplorasi buku, perangkat, dan kegiatan inspiratif.`,
      `Beri apresiasi deskriptif terhadap proses latihan dan ketekunannya.`,
    ],
    futureCareerDirections: [
      {
        field: `Bidang Terkait ${top1.name}`,
        exampleProfessions: [
          'Profesional / Peneliti',
          'Praktisi Spesialis',
          'Kreator Inovasi',
        ],
      },
    ],
    nonDiagnosticDisclaimer:
      'Laporan Pemetaan Bakat ini disusun berbasis observasi pedagogis dan teori Multiple Intelligences untuk keperluan pembinaan belajar, bukan asesmen klinis.',
  };
}
