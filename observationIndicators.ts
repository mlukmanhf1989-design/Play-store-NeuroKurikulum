import { DomainCheckItem, ObservationDomainKey } from '../types';

export interface DomainMetadata {
  key: ObservationDomainKey;
  title: string;
  shortDesc: string;
  iconName: string;
  color: string;
}

export const DOMAIN_METADATA_LIST: DomainMetadata[] = [
  {
    key: 'attention_executive',
    title: 'Atensi & Fungsi Eksekutif',
    shortDesc: 'Rentang fokus, hambatan impuls, working memory, dan fleksibilitas perpindahan tugas.',
    iconName: 'Target',
    color: 'indigo',
  },
  {
    key: 'motor_praxis',
    title: 'Motorik, Gerakan & Praksis',
    shortDesc: 'Koordinasi motorik kasar/halus, perencanaan gerak, postur, dan gerakan berulang (stimming/fidgeting).',
    iconName: 'Activity',
    color: 'emerald',
  },
  {
    key: 'communication_language',
    title: 'Bahasa & Komunikasi Pragmatis',
    shortDesc: 'Pemahaman instruksi verbal, ungkapan ide, intonasi (prosodi), gestur, dan percakapan timbal balik.',
    iconName: 'MessageSquare',
    color: 'amber',
  },
  {
    key: 'social_emotional',
    title: 'Respons Sosial & Regulasi Diri',
    shortDesc: 'Kontak mata, atensi bersama (joint attention), interaksi teman sebaya, dan regulasi emosi.',
    iconName: 'HeartHandshake',
    color: 'rose',
  },
  {
    key: 'sensory_processing',
    title: 'Pemrosesan Sensori',
    shortDesc: 'Respons terhadap suara, cahaya, sentuhan tekstur, gerakan tubuh (vestibular), dan tekanan (proprioseptif).',
    iconName: 'Sparkles',
    color: 'cyan',
  },
  {
    key: 'cognitive_play',
    title: 'Fleksibilitas Kognitif & Pola Bermain',
    shortDesc: 'Bermain simbolik/imajinatif, ketertarikan minat mendalam, eksplorasi sebab-akibat, dan pemecahan masalah.',
    iconName: 'Puzzle',
    color: 'violet',
  },
];

export const MASTER_OBSERVATION_INDICATORS: DomainCheckItem[] = [
  // Atensi & Fungsi Eksekutif
  {
    id: 'att_1',
    category: 'attention_executive',
    label: 'Fokus intens pada aktivitas minat pribadi (>15 menit)',
    description: 'Mampu mempertahankan perhatian mendalam pada hal yang disukai namun sulit dialihkan.',
    selected: false,
  },
  {
    id: 'att_2',
    category: 'attention_executive',
    label: 'Mudah terdistraksi oleh stimulus visual/auditori lingkungan',
    description: 'Pandangan atau perhatian sering terpecah saat ada suara langkah, jendela terbuka, atau warna mencolok.',
    selected: false,
  },
  {
    id: 'att_3',
    category: 'attention_executive',
    label: 'Memerlukan petunjuk langkah demi langkah (Step-by-step)',
    description: 'Instruksi majemuk (>2 perintah sekaligus) sering terputus di tengah pengerjaan.',
    selected: false,
  },
  {
    id: 'att_4',
    category: 'attention_executive',
    label: 'Kebutuhan jeda aktif (Brain Breaks) setiap 10-15 menit',
    description: 'Menunjukkan tanda gelisah atau lelah kognitif jika harus duduk diam terlalu lama.',
    selected: false,
  },
  {
    id: 'att_5',
    category: 'attention_executive',
    label: 'Spontanitas tinggi dalam merespons stimulus (Impulsivitas alami)',
    description: 'Langsung bertindak atau menjawab sebelum aba-aba atau pertanyaan selesai diucapkan.',
    selected: false,
  },

  // Motorik & Praksis
  {
    id: 'mot_1',
    category: 'motor_praxis',
    label: 'Gerakan aktif konstan (fidgeting, mengayun kaki, berpindah tempat)',
    description: 'Membutuhkan input gerak untuk menjaga keterjagaan kognitif saat menyimak.',
    selected: false,
  },
  {
    id: 'mot_2',
    category: 'motor_praxis',
    label: 'Keterampilan motorik halus presisi (manipulasi balok kecil / puzzle detail)',
    description: 'Mampu memegang benda kecil dengan koordinasi jemari yang stabil dan teliti.',
    selected: false,
  },
  {
    id: 'mot_3',
    category: 'motor_praxis',
    label: 'Tantangan dalam perencanaan gerak sekuensial (praksis motorik)',
    description: 'Memerlukan waktu lebih lama untuk memprogram urutan gerakan seperti memakai sepatu atau menata alat.',
    selected: false,
  },
  {
    id: 'mot_4',
    category: 'motor_praxis',
    label: 'Gerakan repetitif yang menenangkan diri (Stimming/Fidgeting regulasi)',
    description: 'Melakukan ketukan jari, tepukan halus, atau rocking ringan saat merasa cemas atau bersemangat.',
    selected: false,
  },
  {
    id: 'mot_5',
    category: 'motor_praxis',
    label: 'Koordinasi motorik kasar dinamis (melompat, memanjat, keseimbangan)',
    description: 'Sangat percaya diri dalam aktivitas fisik ruang luas dan rintangan tubuh.',
    selected: false,
  },

  // Bahasa & Komunikasi
  {
    id: 'lan_1',
    category: 'communication_language',
    label: 'Pemahaman bahasa visual lebih cepat daripada verbal lisan',
    description: 'Lebih cepat memahami kartu gambar, infografis, atau demonstrasi contoh langsung.',
    selected: false,
  },
  {
    id: 'lan_2',
    category: 'communication_language',
    label: 'Kosa kata kaya pada bidang minat khusus',
    description: 'Menggunakan terminologi spesifik dan detail untuk topik yang sangat diminatinya.',
    selected: false,
  },
  {
    id: 'lan_3',
    category: 'communication_language',
    label: 'Gaya bicara literal & membutuhkan penjelasan eksplisit',
    description: 'Memahami kiasan atau sindiran halus secara harfiah, butuh kalimat lugas.',
    selected: false,
  },
  {
    id: 'lan_4',
    category: 'communication_language',
    label: 'Bahasa ekspresif masih berkembang / mengandalkan gestur bantu',
    description: 'Menggunakan tunjukan tangan, ekspresi wajah, atau kata kunci ringkas untuk mengutarakan kebutuhan.',
    selected: false,
  },
  {
    id: 'lan_5',
    category: 'communication_language',
    label: 'Pola intonasi (prosodi) khas / mengulang frasa favorit (echolalia fungsional)',
    description: 'Meminjam potongan kalimat dari buku cerita atau video untuk mengekspresikan emosi saat itu.',
    selected: false,
  },

  // Sosial & Emosi
  {
    id: 'soc_1',
    category: 'social_emotional',
    label: 'Memulai interaksi sosial dengan cara unik (membawa benda favorit)',
    description: 'Mendekati teman dengan menunjukkan karya atau mainan daripada menyapa secara verbal.',
    selected: false,
  },
  {
    id: 'soc_2',
    category: 'social_emotional',
    label: 'Peka terhadap nada emosi guru / teman di sekitar (Empati intuitif)',
    description: 'Langsung menyadari perubahan suasana hati orang terdekat dan menunjukkan kepedulian.',
    selected: false,
  },
  {
    id: 'soc_3',
    category: 'social_emotional',
    label: 'Tantangan saat terjadi perubahan jadwal mendadak (Transisi)',
    description: 'Membutuhkan peringatan waktu mundur (5 menit lagi, 2 menit lagi) sebelum berganti aktivitas.',
    selected: false,
  },
  {
    id: 'soc_4',
    category: 'social_emotional',
    label: 'Nyaman bermain paralel di samping teman sebaya (Parallel Play)',
    description: 'Menikmati kehadiran teman di ruang yang sama dengan aktivitas masing-masing sebelum kolaborasi erat.',
    selected: false,
  },
  {
    id: 'soc_5',
    category: 'social_emotional',
    label: 'Regulasi diri efektif melalui ruang tenang (Calm-down corner)',
    description: 'Mampu pulih dari kelelahan sensori/emosi setelah beristirahat sebentar di tempat teduh.',
    selected: false,
  },

  // Pemrosesan Sensori
  {
    id: 'sen_1',
    category: 'sensory_processing',
    label: 'Pencari Sensori Gerak & Tekanan (Sensory Seeking Proprioceptive)',
    description: 'Menyukai aktivitas dorong, tarik, pelukan erat, beban tubuh, dan melompat (heavy work).',
    selected: false,
  },
  {
    id: 'sen_2',
    category: 'sensory_processing',
    label: 'Sensitivitas terhadap kebisingan tiba-tiba (Auditory Overload)',
    description: 'Menutup telinga atau gelisah saat mendengar bel sekolah, blender, atau sorak-sorai ramai.',
    selected: false,
  },
  {
    id: 'sen_3',
    category: 'sensory_processing',
    label: 'Eksplorasi taktil tinggi (menyentuh berbagai tekstur, air, pasir, playdough)',
    description: 'Menemukan ketenangan dan fokus saat tangan menyentuh media raba bertekstur.',
    selected: false,
  },
  {
    id: 'sen_4',
    category: 'sensory_processing',
    label: 'Menghindari tekstur lengket / basah tertentu (Tactile Defensiveness)',
    description: 'Enggan menyentuh cat basah, lem, atau makanan berlendir tanpa alat bantu sendok/kuas.',
    selected: false,
  },
  {
    id: 'sen_5',
    category: 'sensory_processing',
    label: 'Kenyamanan optimal dengan pencahayaan alami yang lembut',
    description: 'Lebih tenang di ruangan dengan cahaya teduh dibandingkan lampu neon fluorescent putih tajam.',
    selected: false,
  },

  // Fleksibilitas Kognitif & Pola Bermain
  {
    id: 'cog_1',
    category: 'cognitive_play',
    label: 'Pola bermain menyusun pola berurutan / kategorisasi logis rapi',
    description: 'Suka mengelompokkan miniatur benda berdasarkan warna, ukuran, atau tipe secara simetris.',
    selected: false,
  },
  {
    id: 'cog_2',
    category: 'cognitive_play',
    label: 'Kreativitas tinggi dalam permainan pura-pura (Pretend/Symbolic Play)',
    description: 'Menggunakan balok kayu sebagai pesawat atau telepon dengan cerita dramatis yang kaya.',
    selected: false,
  },
  {
    id: 'cog_3',
    category: 'cognitive_play',
    label: 'Daya ingat visual-spasial kuat terhadap tata letak dan detail gambar',
    description: 'Mengingat detail kecil yang terlewatkan orang lain pada buku cerita atau peta ruangan.',
    selected: false,
  },
  {
    id: 'cog_4',
    category: 'cognitive_play',
    label: 'Menyukai rutinitas terstruktur dengan alur yang dapat diprediksi',
    description: 'Belajar dengan kepercayaan diri tinggi ketika jadwal visual harian terpampang jelas.',
    selected: false,
  },
  {
    id: 'cog_5',
    category: 'cognitive_play',
    label: 'Kemampuan eksplorasi sebab-akibat mekanikal (membongkar pasang alat)',
    description: 'Tertarik mendalam pada cara kerja engsel pintu, roda gigi, sakelar listrik mainan.',
    selected: false,
  },
];
