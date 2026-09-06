# Deployment Vercel — Neuropsikologi Curriculum AI

Versi ini sudah dipisahkan antara frontend React/Vite dan API Express yang dapat dijalankan sebagai Vercel Function.

## Fitur autentikasi

- Login server utama menggunakan `ADMIN_USERNAME` + `ADMIN_PASSWORD`.
- Registrasi hanya untuk `lembaga`, `peneliti`, dan `psikolog`.
- Form registrasi: Nama Lembaga/Peneliti/Psikolog, Username, Password, Peran, Kota/Wilayah, Token.
- Password pengguna di-hash menggunakan `scrypt`; password tidak disimpan di frontend.
- Token registrasi hanya dibaca server melalui `REGISTER_TOKEN`.
- Session menggunakan token bertanda tangan dengan `AUTH_SECRET`.
- Server Utama dapat menghapus satu akun pengguna atau seluruh akun pengguna.
- Penghapusan/reset database siswa, prestasi, observasi hanya dapat dilakukan oleh Server Utama.
- Audit log tetap tersedia.

## Database Vercel

SQLite lokal pada versi sebelumnya tidak cocok untuk penyimpanan persisten di serverless Vercel. Versi ini menggunakan PostgreSQL.

Gunakan PostgreSQL managed, misalnya Neon melalui Vercel Marketplace, lalu masukkan connection string ke:

`DATABASE_URL`

Tabel akan dibuat otomatis ketika API pertama kali dipanggil.

## Environment Variables

Di Vercel → Project → Settings → Environment Variables, isi:

- `DATABASE_URL` = connection string PostgreSQL
- `GEMINI_API_KEY` = API key Gemini
- `ADMIN_USERNAME` = username Server Utama
- `ADMIN_PASSWORD` = password Server Utama
- `REGISTER_TOKEN` = token rahasia registrasi
- `AUTH_SECRET` = secret acak minimal 32 karakter

Jangan memasukkan password, token registrasi, atau `AUTH_SECRET` ke file React/Vite, `src/`, atau `VITE_*`.

## Deploy

1. Push folder ini ke GitHub/GitLab/Bitbucket.
2. Import repository ke Vercel.
3. Pastikan Environment Variables di atas sudah diisi.
4. Deploy.
5. Uji:
   - `/api/health`
   - Login
   - Register dengan token
   - Tambah siswa
   - Buka Server Utama
   - Hapus satu akun pengguna
   - Hapus semua akun pengguna
   - Backup/reset/purge database

## Local development

```bash
npm install
npm run dev
```

Untuk local database, gunakan PostgreSQL dan set `DATABASE_URL`.

## Catatan keamanan

Kredensial Server Utama dan token registrasi sengaja tidak ditanamkan ke source code. Ini penting agar saat source code di-upload ke GitHub atau Vercel, rahasia tidak ikut terbuka.
