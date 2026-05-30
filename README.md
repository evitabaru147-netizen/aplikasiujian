# Aplikasi Pengawasan Ujian AI

Aplikasi web pengawasan ujian menggunakan kamera dan AI deteksi wajah — **100% HTML statis**, tidak perlu Node.js/npm.

## Fitur

- ✅ Deteksi wajah real-time (Webcam atau Kamera Statis)
- ✅ Peringatan otomatis: tidak ada wajah / lebih dari satu wajah
- ✅ Logs disimpan di browser (localStorage)
- ✅ Screenshot bukti otomatis saat deteksi anomali
- ✅ Responsif untuk desktop dan mobile

## Instalasi & Jalankan

### Di GitHub Codespace

1. Buka file `index.html` di VS Code
2. Klik kanan → **"Open with Live Server"** (atau install extension Live Server jika belum)
3. Browser akan membuka aplikasi di URL lokal (mis. `http://localhost:5500`)
4. Izinkan akses kamera ketika diminta

### Di Komputer Lokal

- Buka file `index.html` langsung di browser (double-click) atau
- Jalankan simple HTTP server:
  ```bash
  python -m http.server 8000
  # atau
  npx http-server
  ```
- Buka `http://localhost:8000/index.html`

## Struktur Proyek

- `index.html` - file utama (HTML + CSS + JavaScript self-contained)
- `README.md` - dokumentasi ini
- `.gitignore` - file git ignore

## Cara Pakai

### Mode Webcam

1. Buka aplikasi di browser
2. Mode default: **Webcam (kamera pengguna)**
3. Izinkan akses kamera
4. Klik tombol **"Mulai Pengawasan"**
5. Aplikasi mendeteksi wajah real-time

### Mode Kamera Statis

1. Buka aplikasi di browser
2. Ubah dropdown ke **"Kamera Statis (URL)"**
3. Input URL stream kamera (MJPEG/HTTP):
   - Contoh: `http://192.168.1.100/mjpeg`
   - Klik **"Tes URL"** untuk validasi
4. Klik **"Mulai Pengawasan"**
5. Sistem akan mendeteksi wajah dari stream

## Logs & Data

- **Logs disimpan di**: Browser `localStorage`
- **Otomatis dihapus saat**: Clear browser cache / storage
- **Cara lihat logs**: Inspect → Application → Local Storage
- **Clear logs**: Klik tombol "Hapus Riwayat" di panel

## Model AI

- TensorFlow.js (v4.12.0)
- BlazeFace (model deteksi wajah ringan)
- Dimuat dari CDN — butuh internet pertama kali

## Tips

- Pastikan kamera statis memiliki URL yang dapat diakses browser (CORS-friendly)
- Untuk kamera RTSP, ubah ke stream MJPEG/HTTP terlebih dahulu
- Screenshot otomatis saat deteksi anomali disimpan di memory browser
- Logs disimpan sampai browser cache dihapus

## Troubleshooting

**"Gagal mengakses kamera"**
- Izinkan kamera di browser settings
- Gunakan HTTPS jika di production (getUserMedia butuh secure context)

**"Gagal memuat stream kamera statis"**
- Periksa URL stream (buka di tab baru)
- Pastikan URL support CORS (atau gunakan proxy)
- Test URL dengan tombol "Tes URL"

**"Model AI tidak load"**
- Periksa koneksi internet
- Refresh halaman
- Cek console browser (F12 → Console)
