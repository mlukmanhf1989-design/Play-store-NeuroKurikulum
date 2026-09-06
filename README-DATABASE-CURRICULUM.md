# Database & Curriculum Update

## Database persisten
Aplikasi sekarang memakai **SQLite persisten** melalui `node:sqlite` (Node.js 22.5+). Data yang disimpan:
- Siswa master
- Prestasi siswa
- Audit log
- Riwayat observasi + hasil analisis AI

Endpoint utama:
- `GET /api/database/health`
- `GET /api/database/snapshot`
- `POST/PUT/DELETE /api/database/students`
- `POST/DELETE /api/database/achievements`
- `POST /api/database/observations`
- `POST /api/database/audit`
- `POST /api/database/reset`
- `POST /api/database/purge`

Untuk hosting, gunakan Node.js 22.5+ dan pasang `DATA_DIR` pada disk/volume persisten. Jika hosting menyediakan persistent volume, arahkan `DATABASE_PATH` ke lokasi tersebut.

## Kurikulum
Ditambahkan menu perbandingan dan pemilihan target:
1. **Kurikulum Merdeka Fase B** — SD kelas III–IV.
2. **Kurikulum Merdeka Fase C** — SD kelas V–VI.
3. **Cambridge International** — Primary–Secondary.
4. **Singapore Curriculum** — Primary–Secondary.

Kerangka tersebut dapat dipilih sebagai target observasi dan dipakai bersama mesin analisis neuropsikologi/Computer Vision.
