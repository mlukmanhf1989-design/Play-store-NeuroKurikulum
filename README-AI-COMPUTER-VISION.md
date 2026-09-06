# Dimensi Neuropsikologi dalam Mendesain Kurikulum

Versi ini menambahkan **AI Observation Engine — Computer Vision** ke aplikasi.

## Fitur Computer Vision
- Kamera HP / webcam melalui `getUserMedia()`.
- Object Detection menggunakan **COCO-SSD Lite MobileNet v2**.
- Object Tracking berbasis centroid tracking.
- People Counting (jumlah objek `person` yang terdeteksi pada frame terakhir).
- Movement Detection berbasis perbedaan frame.
- Confidence score dan bounding box realtime.
- Hasil observasi CV otomatis dapat dimasukkan ke catatan observasi untuk dianalisis oleh Gemini.

## Catatan hosting
Computer Vision berjalan di browser, sehingga server hosting tidak harus memiliki GPU. Browser memerlukan:
1. HTTPS (atau `localhost` saat pengembangan) agar akses kamera diizinkan.
2. Internet untuk memuat TensorFlow.js dan COCO-SSD dari jsDelivr.
3. Izin kamera dari pengguna.

Gemini tetap berjalan melalui backend Node.js/Express dan membutuhkan `GEMINI_API_KEY`.

## Jalankan
```bash
npm install
npm run dev
```

Production:
```bash
npm run build
NODE_ENV=production npm start
```

## Etika
Computer Vision hanya menghasilkan pengamatan visual seperti objek, gerakan, dan jumlah orang. Hasil bukan diagnosis klinis. Interpretasi perkembangan harus diverifikasi pendidik/profesional.
