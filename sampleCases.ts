import { SampleCase } from '../types';

export const SAMPLE_CASES: SampleCase[] = [
  {
    id: 'case-bima',
    title: 'Bima (5 thn 4 bln) - Pelajar Kinestetik & Pencari Sensori Motorik',
    ageText: '5 Tahun 4 Bulan',
    tag: 'Sensory-Seeking Kinestetik',
    summary: 'Anak sangat aktif bergerak, memiliki ketertarikan mekanikal mendalam pada transportasi, atensi tinggi pada tugas berbasis raba & gerak.',
    data: {
      childMeta: {
        childName: 'Bima Satria',
        ageYears: 5,
        ageMonths: 4,
        gender: 'Laki-laki',
        observerName: 'Ibu Ratna Dewi, S.Pd.',
        observerRole: 'Guru Kelas',
        observationSetting: 'Ruang Kelas PAUD/TK',
        observationDuration: '45 Menit (Sesi Bermain Bebas & Lingkaran Pagi)',
        curriculumTarget: 'Kurikulum Merdeka (PAUD/Fase Fondasi)',
        focusNotes: 'Bima kesulitan duduk tenang saat mendengarkan cerita lebih dari 5 menit, namun mampu menyusun balok bertingkat 20 menit tanpa henti.',
      },
      selectedIndicators: [
        'att_1', // Fokus intens pada aktivitas minat pribadi (>15 menit)
        'att_4', // Kebutuhan jeda aktif (Brain Breaks) setiap 10-15 menit
        'att_5', // Spontanitas tinggi dalam merespons stimulus (Impulsivitas alami)
        'mot_1', // Gerakan aktif konstan (fidgeting, mengayun kaki)
        'mot_5', // Koordinasi motorik kasar dinamis
        'lan_1', // Pemahaman bahasa visual lebih cepat daripada verbal lisan
        'lan_2', // Kosa kata kaya pada bidang minat khusus (kereta & roda gigi)
        'soc_1', // Memulai interaksi sosial dengan membawa benda favorit
        'soc_3', // Tantangan saat terjadi perubahan jadwal mendadak
        'sen_1', // Pencari Sensori Gerak & Tekanan (Proprioceptive Seeking)
        'sen_3', // Eksplorasi taktil tinggi
        'cog_5', // Kemampuan eksplorasi sebab-akibat mekanikal
      ],
      anecdotalNotes: `Catatan Kejadian Spesifik:
1. Saat Circle Time (08:30 - 08:45): Bima berulang kali merangkak ke samping karpet dan memutar roda miniatur truk. Ketika diminta duduk kembali, ia mengayunkan kakinya berirama.
2. Sesi Sentra Balok (08:50 - 09:15): Bima membangun jembatan kereta api bertingkat 3 yang simetris. Saat seorang teman mendekat, Bima tidak berbicara langsung tetapi memberikan gerbong kereta ke tangan temannya sebagai isyarat mengajak bermain bersama.
3. Transisi Merapikan Mainan (09:20): Bima menolak melepaskan balok saat bel berbunyi tiba-tiba. Guru mendekat dan memberikan timer pasir 3 menit, setelah melihat pasir turun Bima bersedia membantu mengangkat kotak balok yang berat dengan antusias (tampak senang dengan aktivitas angkat beban/heavy work).`,
      mediaAttachments: [
        {
          type: 'video',
          name: 'observasi_bima_sentra_balok.mp4',
          size: '18.4 MB',
          duration: '02:45',
          description: 'Rekaman video interaksi Bima saat menyusun lintasan kereta bertingkat dan merespons ajakan teman.',
        },
        {
          type: 'audio',
          name: 'rekaman_prosodi_bima.m4a',
          size: '2.1 MB',
          duration: '01:10',
          description: 'Audio percakapan Bima menjelaskan bagian mesin lokomotif kepada guru pendamping.',
        },
      ],
    },
  },
  {
    id: 'case-alya',
    title: 'Alya (6 thn 2 bln) - Pemikir Visual & Sensitivitas Auditori Ruang Ramai',
    ageText: '6 Tahun 2 Bulan',
    tag: 'Visual-Spasial & Sensitif Auditori',
    summary: 'Anak memiliki memori visual fotografi dan daya gambar detail, namun cepat lelah kognitif jika berada di ruangan akustik bising.',
    data: {
      childMeta: {
        childName: 'Alya Putri Kirana',
        ageYears: 6,
        ageMonths: 2,
        gender: 'Perempuan',
        observerName: 'Bapak Hendra, M.Psi.',
        observerRole: 'Psikolog Pendidikan',
        observationSetting: 'Ruang Kelas SD Awal',
        observationDuration: '60 Menit (Mata Pelajaran Tematik & Istirahat)',
        curriculumTarget: 'Kurikulum Merdeka (Fase A/Kelas 1-2 SD)',
        focusNotes: 'Alya sangat pendiam di kelompok besar, sering menutup telinga saat jam istirahat kantin, namun sangat terampil memetakan huruf dan diagram warna.',
      },
      selectedIndicators: [
        'att_1', // Fokus intens
        'att_2', // Mudah terdistraksi suara lingkungan
        'att_3', // Memerlukan petunjuk langkah demi langkah
        'mot_2', // Keterampilan motorik halus presisi
        'lan_1', // Pemahaman bahasa visual lebih cepat
        'lan_3', // Gaya bicara literal
        'soc_4', // Nyaman bermain paralel
        'soc_5', // Regulasi diri efektif melalui ruang tenang
        'sen_2', // Sensitivitas terhadap kebisingan (Auditory overload)
        'sen_5', // Kenyamanan optimal dengan pencahayaan lembut
        'cog_1', // Pola bermain menyusun pola berurutan
        'cog_3', // Daya ingat visual-spasial kuat
        'cog_4', // Menyukai rutinitas terstruktur
      ],
      anecdotalNotes: `Catatan Observasi Alya:
1. Pengerjaan Lembar Kerja Menggambar (09:00 - 09:30): Alya menggambar siklus metamorfosis kupu-kupu dengan proporsi warna dan anatomi yang sangat presisi, melampaui rata-rata usianya.
2. Respon Bunyi Speaker Pengumuman (09:35): Saat speaker berbunyi keras, Alya langsung meletakkan pensil dan menutupi kedua telinganya dengan kedua telapak tangan selama 3 menit sampai suasana tenang kembali.
3. Pembagian Kelompok Diskusi: Alya tampak cemas ketika 4 temannya berbicara serentak. Setelah guru memindahkannya ke meja sudut dekat jendela dengan kartu petunjuk bergambar, Alya kembali menyelesaikan tugas klasifikasi gambar tanpa kesulitan.`,
      mediaAttachments: [
        {
          type: 'image',
          name: 'karya_gambar_anatomi_alya.png',
          size: '3.4 MB',
          description: 'Foto karya gambar siklus metamorfosis Alya dengan detail visual tinggi.',
        },
        {
          type: 'video',
          name: 'transisi_ruang_tenang_alya.mp4',
          size: '12.8 MB',
          duration: '01:30',
          description: 'Video teknik regulasi mandiri Alya di sudut tenang kelas (reading corner).',
        },
      ],
    },
  },
  {
    id: 'case-dafi',
    title: 'Dafi (4 thn 8 bln) - Eksplorer Imajinatif & Bahasa Ekspresif Berkembang',
    ageText: '4 Tahun 8 Bulan',
    tag: 'Imajinatif & Bahasa Berkembang',
    summary: 'Memiliki pemikiran simbolik kaya dan empati hangat, mengandalkan gestur visual dan peragaan untuk mengkomunikasikan gagasan besarnya.',
    data: {
      childMeta: {
        childName: 'Dafi Ahmad',
        ageYears: 4,
        ageMonths: 8,
        gender: 'Laki-laki',
        observerName: 'Ustadzah Nurul, S.Pd.I.',
        observerRole: 'Guru Pendamping Khusus (GPK)',
        observationSetting: 'Area Bermain / Outdoor',
        observationDuration: '40 Menit (Bermain Sosio-Dramatis Luar Ruang)',
        curriculumTarget: 'Pendekatan Montessori',
        focusNotes: 'Dafi sangat ekspresif secara mimik wajah dan gestur tubuh, menyukai permainan peran pura-pura, membutuhkan scaffolding pengucapan kata.',
      },
      selectedIndicators: [
        'att_1', // Fokus minat pribadi
        'mot_4', // Gerakan regulasi menenangkan
        'mot_5', // Motorik kasar dinamis
        'lan_1', // Bahasa visual
        'lan_4', // Bahasa ekspresif berkembang / gestur bantu
        'lan_5', // Pola intonasi khas
        'soc_1', // Interaksi cara unik
        'soc_2', // Peka emosi kawan
        'sen_3', // Eksplorasi taktil
        'sen_4', // Menghindari tekstur lengket tertentu
        'cog_2', // Kreativitas tinggi permainan peran (pretend play)
      ],
      anecdotalNotes: `Catatan Lapangan Dafi:
1. Permainan Peran Dokter Hewan (10:00 - 10:20): Dafi menggunakan ranting kayu sebagai stetoskop dan daun kering sebagai perban untuk boneka kelinci. Saat boneka "diobati", ia mengeluarkan suara efek 'sshhh-sshhh' dan mengelus boneka dengan sangat lembut.
2. Permintaan Air Minum: Dafi menarik tangan guru ke arah dispenser lalu memperagakan gerakan meminum gelas dengan kedua tangan, tersenyum lebar ketika guru menvalidasi: "Dafi mau minum air segar ya?".
3. Interaksi dengan Teman yang Menangis: Ketika seorang teman terjatuh di pasir, Dafi menghampiri dan menyodorkan daun berbentuk hati sambil tersenyum hangat.`,
      mediaAttachments: [
        {
          type: 'video',
          name: 'pretend_play_dafi_outdoor.mp4',
          size: '15.2 MB',
          duration: '02:10',
          description: 'Video aktivitas pretend play Dafi mengobati boneka hewan dengan ranting dan daun.',
        },
      ],
    },
  },
];
