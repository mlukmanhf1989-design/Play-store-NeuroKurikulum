import { ComprehensiveAnalysisResult, LearningActivityDesign, ObservationData } from '../types';

export function generateClientFallbackAnalysis(observationData: ObservationData): ComprehensiveAnalysisResult {
  const { childMeta, selectedIndicators, anecdotalNotes } = observationData;
  const isSensorySeeking =
    selectedIndicators?.includes('sen_1') ||
    selectedIndicators?.includes('mot_1') ||
    selectedIndicators?.includes('att_4');
  const isVisualThinker =
    selectedIndicators?.includes('lan_1') ||
    selectedIndicators?.includes('cog_3') ||
    selectedIndicators?.includes('lan_2');

  const childName = childMeta.childName || 'Anak';
  const ageYears = childMeta.ageYears || 5;

  return {
    id: `analysis-${Date.now()}`,
    timestamp: new Date().toISOString(),
    childMeta,
    nonDiagnosticDisclaimer:
      'HASIL OBSERVASI NON-DIAGNOSTIK: Laporan ini dirancang khusus untuk tujuan pedagogis, pemetaan gaya belajar, dan penyusunan diferensiasi kurikulum di lingkungan sekolah/rumah. Hasil ini BUKAN diagnosis medis, psikiatri, atau evaluasi klinis. Konsultasikan dengan dokter spesialis anak atau psikolog klinis berlisensi jika memerlukan asesmen medis diagnostik.',
    neurodevelopmentalStyle: {
      archetypeTitle: isSensorySeeking
        ? 'Pembelajar Kinestetik-Eksploratif dengan Regulasi Proprioseptif Dinamis'
        : isVisualThinker
        ? 'Pemikir Visual-Spasial Mendalam dengan Pemrosesan Detail Presisi'
        : 'Pembelajar Multisensori Berbasis Minat Khusus & Hubungan Afektif',
      description: `${childName} menunjukkan pemrosesan informasi yang sangat optimal apabila dikaitkan dengan pengalaman manipulasi langsung, media visual runtut, dan konteks minat personalnya. Kapasitas atensi dan keterlibatan aktif berada pada tingkat tertinggi saat lingkungan belajar memberikan ruang gerak terarah dan instruksi terstruktur.`,
      primaryLearningModality: isSensorySeeking ? 'Kinestetik-Proprioseptif' : 'Visual-Spasial',
      keyStrengths: [
        'Daya konsentrasi mendalam pada aktivitas berbasis manipulasi alat dan minat pribadi',
        'Keterampilan spasial, pengenalan pola visual, dan konstruksi alat yang sangat baik',
        'Sensitivitas intuitif terhadap dinamika suasana lingkungan dan pendekatan hangat guru',
        'Kemandirian tinggi saat diberikan tugas terstruktur dengan alur langkah yang jelas',
      ],
      emergingSkills: [
        'Kemampuan regulasi diri saat menghadapi transisi pergantian jadwal kegiatan',
        'Peluasan kosakata ekspresif dalam interaksi kelompok dan diskusi terarah',
        'Fleksibilitas dalam berbagi giliran dan kolaborasi proyek konstruktif bersama teman',
      ],
      prioritySupportAreas: [
        'Penyediaan jeda gerak aktif (brain breaks / heavy work) setiap 10-15 menit',
        'Pengurangan stimulasi kebisingan audio berlebihan di ruang kelas saat jam fokus',
        'Penggunaan papan jadwal visual bergambar (visual schedule) untuk memandu tahapan harian',
      ],
    },
    domainScores: [
      {
        domain: 'attention_executive',
        domainLabel: 'Atensi & Fungsi Eksekutif',
        score: isSensorySeeking ? 74 : 78,
        summary: 'Rentang fokus optimal pada aktivitas minat mendalam, memerlukan panduan sekuensial langkah demi langkah.',
        observedBehaviors: [
          'Mampu berkonsentrasi hingga 15-20 menit pada tugas manipulatif yang diminati',
          'Mudah beralih perhatian saat ada stimulus auditori atau pergerakan mendadak',
        ],
        recommendedSupport: 'Gunakan timer visual dan petunjuk satu per satu (First-Then cards).',
      },
      {
        domain: 'motor_praxis',
        domainLabel: 'Motorik & Gerakan',
        score: 82,
        summary: 'Koordinasi motorik kasar dan manipulasi objek sangat aktif dan terarah.',
        observedBehaviors: [
          'Suka berpindah posisi dan menggerakkan tubuh untuk menjaga keterjagaan saraf (arousal level)',
          'Kekuatan genggaman dan manipulasi alat balok/alat raba sangat stabil',
        ],
        recommendedSupport: 'Sediakan alternatif tempat duduk aktif (wobble stool atau sensory cushion).',
      },
      {
        domain: 'communication_language',
        domainLabel: 'Bahasa & Komunikasi',
        score: 72,
        summary: 'Memahami instruksi berbasis visual dan peragaan lebih cepat dibanding ceramah lisan panjang.',
        observedBehaviors: [
          'Menggunakan kata kunci ringkas dan gestur untuk mengekspresikan maksud',
          'Menguasai istilah spesifik pada tema yang disukai secara fasih',
        ],
        recommendedSupport: 'Kombinasikan kalimat verbal dengan kartu simbol/gambar pendukung.',
      },
      {
        domain: 'social_emotional',
        domainLabel: 'Sosial & Regulasi Diri',
        score: 70,
        summary: 'Bermain dengan nyaman dalam format parallel play; butuh pendampingan lembut saat transisi.',
        observedBehaviors: [
          'Mendekati teman dengan membagikan mainan kesukaannya sebagai sinyal interaksi',
          'Membutuhkan waktu penyesuaian saat berpindah ke aktivitas kelompok baru',
        ],
        recommendedSupport: 'Beri peringatan waktu mundur (5 menit dan 2 menit) sebelum pergantian aktivitas.',
      },
      {
        domain: 'sensory_processing',
        domainLabel: 'Pemrosesan Sensori',
        score: isSensorySeeking ? 86 : 76,
        summary: 'Menunjukkan kebutuhan input proprioseptif (heavy work) untuk ketenangan sistem saraf.',
        observedBehaviors: [
          'Menikmati aktivitas mengangkat, mendorong, dan meraba tekstur konkrit',
          'Lebih nyaman di sudut kelas dengan pencahayaan lembut dan suasana kondusif',
        ],
        recommendedSupport: 'Sediakan sudut tenang (calming zone) dan media raba terarah.',
      },
      {
        domain: 'cognitive_play',
        domainLabel: 'Fleksibilitas Kognitif & Pola Bermain',
        score: 85,
        summary: 'Kemampuan analisis pola, klasifikasi objek, dan eksplorasi mekanikal sangat menonjol.',
        observedBehaviors: [
          'Menyusun dan mengelompokkan benda secara teratur dan sistematis',
          'Memperlihatkan rasa ingin tahu tinggi terhadap mekanisme kerja sebab-akibat',
        ],
        recommendedSupport: 'Manfaatkan pola dan diagram dalam mengenalkan konsep sains serta numerasi awal.',
      },
    ],
    pedagogicalImpact: {
      instructionProcessing:
        'Instruksi paling efektif disampaikan secara visual (gambar/diagram alur) atau demonstrasi fisik 1-on-1, diiringi kalimat singkat maksimal 5-7 kata per arahan.',
      physicalEnvironmentNeeds: [
        'Penempatan meja di area samping dengan minim distraksi jendela jalan lalu lalang',
        'Pencahayaan alami atau lampu dengan tingkat kecerahan sedang (hindari silau berlebih)',
        'Akses mudah menuju sudut tenang (calming zone / quiet corner) saat anak merasa lelah',
        'Penyediaan wadah sensori (sensory bin) di sudut sentra kelas',
      ],
      optimalFocusSpanMinutes: Math.min(Math.max(ageYears * 2 + 2, 8), 20),
      brainBreakIntervalMinutes: Math.min(Math.max(ageYears * 3, 10), 25),
      transitionStrategy:
        'Penggunaan visual schedule board, hitung mundur pasir (sand timer), dan lagu transisi berirama tetap sebelum berpindah ruang.',
      stressTriggers: [
        'Suara bising keras mendadak (bel sekolah berfrekuensi tinggi / teriakan serentak)',
        'Tuntutan duduk diam kaku di meja lebih dari 15 menit tanpa jeda peregangan',
        'Instruksi majemuk bertumpuk tanpa jeda waktu pengerjaan',
      ],
      coRegulationTechniques: [
        'Aktivitas heavy work (membawa buku atau mendorong kotak mainan bersama guru pendamping)',
        'Teknik pernapasan 5 jari (starfish breathing) dengan stimulasi taktil sentuhan lembut',
        'Duduk berdampingan di sudut tenang sambil mengamati buku bergambar bertema favorit',
      ],
    },
    curriculumAdaptations: {
      curriculumName: childMeta.curriculumTarget || 'Kurikulum Merdeka (PAUD/Fase Fondasi)',
      contentDifferentiation: [
        `Mengaitkan tema pembelajaran tematik dengan minat intrinsik ${childName}`,
        'Menyajikan materi melalui media konkrit 3D dan kartu visual infografis yang runtut',
        'Menyederhanakan teks panjang menjadi rangkaian simbol gambar yang mudah dipahami',
      ],
      processDifferentiation: [
        'Memberikan opsi bekerja sambil berdiri atau menggunakan alas duduk sensori (wobble cushion)',
        'Membagi tugas besar menjadi 3 subtugas mikro dengan lembar checklist visual mandiri',
        'Mengizinkan anak mengeksplorasi secara kinestetik/manipulatif sebelum memberikan respon verbal',
      ],
      productDifferentiation: [
        'Mengganti asesmen verbal panjang dengan unjuk karya balok, diagram gambar, atau demonstrasi fisik',
        'Perekaman portofolio video pendek atau foto hasil karya anak sebagai bukti capaian belajar berkala',
      ],
      environmentDifferentiation: [
        'Menyediakan area karpet bebas dengan bantal penopang tubuh untuk bekerja di lantai',
        'Memasang label visual bergambar pada semua kotak alat dan rak kelas untuk melatih kemandirian',
      ],
      recommendedMediaAndTools: [
        {
          category: 'Media Sensori & Regulasi',
          items: ['Sand timer 3 & 5 menit', 'Wobble cushion / alas duduk dinamis', 'Weighted lap pad ringan', 'Fidget tool bertekstur'],
          usageGuidance: 'Digunakan saat sesi menyimak cerita atau mengerjakan tugas meja untuk menjaga fokus stabil.',
        },
        {
          category: 'Media Visual & Komunikasi',
          items: ['Papan visual schedule magnetik', 'Kartu First-Then bergambar', 'Buku cerita pop-up interaktif'],
          usageGuidance: 'Dipasang di sisi meja belajar anak untuk memandu alur kegiatan secara mandiri.',
        },
        {
          category: 'Media Pembelajaran Konkrit',
          items: ['Balok kayu geometri aneka ukuran', 'Miniatur benda bertema minat anak', 'Loose parts alami (batu kerikil halus, biji pinus)'],
          usageGuidance: 'Sebagai media utama pembelajaran konsep numerasi, sains, dan literasi awal yang bermakna.',
        },
      ],
    },
    individualizedLearningPlan: {
      shortTermGoals: [
        `Mampu mengikuti 2 tahapan instruksi bergambar secara mandiri saat kegiatan sentra inti.`,
        `Menggunakan timer pasir untuk menyelesaikan transisi merapikan mainan dengan tenang dan kooperatif.`,
        `Mengajak teman bermain bersama menggunakan media benda favorit atau kartu gambar pendukung.`,
      ],
      longTermGoals: [
        `Mengembangkan strategi regulasi diri mandiri saat mengalami kelelahan sensori atau transisi mendadak.`,
        `Meningkatkan partisipasi aktif dalam diskusi kelompok selama 15 menit dengan dukungan alat peraga manipulatif.`,
      ],
      microActivities: [
        {
          title: 'Misi Ekspedisi Konstruksi & Peta Visual',
          targetDomain: 'Atensi & Fleksibilitas Kognitif',
          duration: '15 Menit',
          objective: 'Melatih rentang atensi berkelanjutan, pengurutan langkah (sequencing), dan klasifikasi spasial.',
          materialsNeeded: ['Balok kayu geometri aneka warna', 'Kartu rancangan konstruksi bergambar', 'Kotak sortir berlabel'],
          stepByStepInstructions: [
            `Guru memperlihatkan kartu visual 'Jembatan Bertingkat' dan mengajak ${childName} mengamati pola bentuk.`,
            'Anak mengambil balok sesuai panduan pola gambar secara mandiri.',
            'Anak menyusun struktur dan menceritakan bagaimana kendaraan atau miniatur dapat melintas.',
            'Setelah selesai, anak menempelkan stiker bintang pada lembar capaian mandirinya.',
          ],
          scaffoldingTactics: 'Guru mendampingi pada 2 balok pertama, lalu memfasilitasi anak menyelesaikan sisanya secara otonom.',
          sensoryIntegrationTip: 'Gunakan balok dengan bobot padat untuk memberikan umpan balik proprioseptif yang mantap.',
          parentTeacherTip: 'Berikan apresiasi pada ketelitian proses anak daripada sekadar kecepatan pengerjaan.',
        },
        {
          title: 'Sirkuit Fonem & Gerak Berirama',
          targetDomain: 'Bahasa & Integrasi Motorik Kasar',
          duration: '20 Menit',
          objective: 'Mengenalkan pengenalan huruf dan kosa kata baru melalui lintasan gerak tubuh aktif.',
          materialsNeeded: ['Kartu huruf bergambar tebal', 'Karpet puzzle busa warna-warni', 'Keranjang bola'],
          stepByStepInstructions: [
            'Susun karpet busa menyerupai jalan setapak di lantai kelas atau ruang bermain.',
            'Anak melompat dari satu pulau karpet ke pulau berikutnya sambil menyebutkan gambar/huruf yang diinjak.',
            'Di ujung lintasan sirkuit, anak memasukkan bola ke keranjang sesuai warna kartu.',
          ],
          scaffoldingTactics: 'Guru memperagakan satu putaran sambil melafalkan fonem secara berirama riang.',
          sensoryIntegrationTip: 'Aktivitas melompat memberikan input vestibular dan proprioseptif yang menyegarkan konsentrasi anak.',
          parentTeacherTip: 'Dapat dipraktikkan di rumah pada lorong ruang keluarga menggunakan bantal duduk.',
        },
        {
          title: 'Laboratorium Raba & Eksplorasi Sebab-Akibat',
          targetDomain: 'Pemrosesan Sensori & Penalaran Kognitif',
          duration: '15 Menit',
          objective: 'Melatih toleransi taktil, konsentrasi tangan-mata, dan pemecahan masalah sederhana.',
          materialsNeeded: ['Wadah berisi beras warna atau pasir kinetik', 'Corong takar, sendok kayu, kelereng besar'],
          stepByStepInstructions: [
            'Ajak anak menuang butiran ke dalam corong untuk mengamati pergerakan butiran.',
            'Minta anak memperkirakan berapa sendok yang diperlukan untuk mengisi tabung transparan hingga batas garis.',
            'Diskusikan sensasi tekstur butiran pada telapak tangan.',
          ],
          scaffoldingTactics: 'Bila anak ragu menyentuh langsung, sediakan sendok bergagang panjang terlebih dahulu.',
          sensoryIntegrationTip: 'Sensasi raba butiran halus membantu menurunkan ketegangan saraf dan menstabilkan emosi anak.',
          parentTeacherTip: 'Lakukan sebelum waktu istirahat atau saat anak mulai memperlihatkan tanda-tanda gelisah.',
        },
      ],
      dailyRoutineRecommendations: [
        {
          timeframe: '08:00 - 08:30 (Kedatangan & Sambutan)',
          activityFocus: 'Transisi Masuk & Heavy Work Ringan',
          neuroSensoryStrategy: 'Ajak anak menaruh tas di loker berlabel foto diri dan bantu membawa kotak peralatan kelas ringan.',
        },
        {
          timeframe: '08:30 - 09:15 (Sesi Pembelajaran Inti 1)',
          activityFocus: 'Eksplorasi Konseptual Multisensori',
          neuroSensoryStrategy: 'Gunakan meja sentra dengan media konkrit 3D; selipkan jeda regang tubuh 2 menit di menit ke-15.',
        },
        {
          timeframe: '09:15 - 09:45 (Istirahat & Bermain Bebas)',
          activityFocus: 'Sosialisasi Kelompok Kecil / Parallel Play',
          neuroSensoryStrategy: 'Sediakan area tenang bagi anak bila merasa lelah dengan kebisingan halaman luar.',
        },
        {
          timeframe: '09:45 - 10:30 (Sesi Inti 2 & Proyek Mandiri)',
          activityFocus: 'Unjuk Kerja Diferensiasi Produk',
          neuroSensoryStrategy: 'Berikan opsi unjuk karya berbasis gambar/bangun balok, dipandu kartu langkah First-Then.',
        },
        {
          timeframe: '10:30 - 11:00 (Refleksi & Penutupan Tenang)',
          activityFocus: 'Review Pengalaman & Penutupan Tenang',
          neuroSensoryStrategy: 'Gunakan lagu penutup yang konsisten dan papan visual capaian hari ini.',
        },
      ],
      evaluationRubric: [
        {
          indicator: 'Menjaga fokus pada aktivitas terstruktur terarah',
          emerging: 'Fokus 3-5 menit dengan bimbingan konstan pendamping',
          progressing: 'Fokus 8-12 menit dengan panduan visual schedule mandiri',
          mastered: 'Fokus >15 menit dan mampu menyelesaikan subtugas hingga tuntas',
        },
        {
          indicator: 'Merespons transisi pergantian kegiatan kelas',
          emerging: 'Memerlukan pendampingan fisik dan bujukan saat jadwal berubah',
          progressing: 'Merespons alarm timer pasir dengan sedikit pengingat verbal',
          mastered: 'Secara mandiri merapikan alat saat visual schedule menunjukkan waktu selesai',
        },
        {
          indicator: 'Interaksi dan kolaborasi bersama teman sebaya',
          emerging: 'Bermain sendiri (solitary play) dan mengamati kawan dari jarak aman',
          progressing: 'Bermain berdampingan (parallel play) dan berbagi mainan',
          mastered: 'Menginisiasi percakapan atau proyek konstruksi bersama dengan bahasa ramah',
        },
      ],
      parentCollabStrategies: [
        'Terapkan jadwal visual harian yang konsisten di rumah untuk rutinitas bangun tidur, makan, belajar, dan istirahat.',
        'Sediakan waktu 15-20 menit bermain lantai (floor-time) tanpa gawai bersama orang tua setiap sore.',
        'Berikan tugas rumah tangga bermakna yang melibatkan input sensori (membawa keranjang pakaian, menyiram tanaman, mengaduk adonan).',
        'Lakukan komunikasi berkala mingguan antara orang tua dan guru melalui buku penghubung atau catatan digital.',
      ],
    },
  };
}

export function generateClientFallbackActivity(
  subjectArea: string,
  specificGoal: string,
  childName: string = 'Anak'
): LearningActivityDesign {
  return {
    title: `Aktivitas Eksploratif: ${subjectArea}`,
    targetDomain: 'Fungsi Eksekutif & Integrasi Multisensori',
    duration: '15 - 20 Menit',
    objective: specificGoal || `Mengembangkan kompetensi ${subjectArea} melalui pendekatan ramah sensori dan manipulasi konkrit.`,
    materialsNeeded: [
      'Alat peraga visual bergambar',
      'Media konkrit / manipulatif (balok, kartu raba, loose parts)',
      'Timer pasir atau penanda visual waktu',
    ],
    stepByStepInstructions: [
      `Guru mengajak ${childName} mengamati objek materi dan mendiskusikan tujuannya dengan bahasa ringkas.`,
      'Anak mencoba manipulasi alat peraga secara langsung dengan bimbingan bertahap (scaffolding).',
      'Anak mendemonstrasikan pemahamannya melalui unjuk karya fisik atau menyusun simbol.',
      'Sesi ditutup dengan apresiasi positif dan refleksi satu hal menyenangkan yang dipelajari.',
    ],
    scaffoldingTactics:
      'Gunakan pendekatan I Do, We Do, You Do: peragakan lebih dulu, lakukan bersama, kemudian beri kesempatan mandiri.',
    sensoryIntegrationTip:
      'Pastikan area kerja bebas dari pantulan cahaya menyilaukan atau suara latar yang memecah konsentrasi.',
    parentTeacherTip:
      'Beri jeda beberapa detik setelah memberikan pertanyaan agar anak memiliki waktu memproses informasi.',
  };
}
