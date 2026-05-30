# Aplikasi Ujian AI

Aplikasi web pengawasan ujian menggunakan kamera dan AI deteksi wajah.

## Fitur

- Deteksi wajah real-time menggunakan kamera web.
- Peringatan ketika tidak ada wajah atau lebih dari satu wajah terdeteksi.
- Log kejadian disimpan pada server.
- Bukti screenshot disimpan saat kondisi mencurigakan terjadi.

## Instalasi

Pastikan Node.js 18+ sudah diinstal.

1. Buka terminal di folder proyek:
   ```bash
   cd /workspaces/aplikasiujian
   ```
2. Pasang dependensi:
   ```bash
   npm install
   ```
3. Jalankan server:
   ```bash
   npm start
   ```
4. Buka browser dan akses:
   ```text
   http://localhost:3000
   ```

## Struktur Proyek

- `server.js` - server Express untuk menyajikan frontend dan API log.
- `public/index.html` - tampilan aplikasi pengawasan ujian.
- `public/app.js` - logika kamera dan AI deteksi wajah.
- `public/styles.css` - styling antarmuka.
- `logs.json` - catatan log sesi.
- `evidence/` - screenshot bukti otomatis.

## Penggunaan

- Izinkan akses kamera ketika diminta.
- Tekan tombol **"Mulai Pengawasan"**.
- Aplikasi akan mendeteksi wajah dan memberi status.
- Jika tidak ada wajah atau lebih dari satu wajah, aplikasi akan mencatat insiden.

## Catatan

Model AI dimuat dari CDN `TensorFlow.js` dan `BlazeFace`.

Jika ingin menambahkan fitur proktor lebih lanjut, berikut ide:

- deteksi tatapan/mata menjauh
- deteksi penggunaan ponsel
- deteksi objek tambahan di meja
