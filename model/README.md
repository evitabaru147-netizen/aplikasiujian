Model BlazeFace (TFJS)
======================

Status:
- Folder ini berisi placeholder `blazeface_tfhub.zip` yang bukan file model TFJS.

Tujuan:
- Jika Anda ingin menjalankan model secara lokal (tanpa CDN), letakkan file model TensorFlow.js di `model/blazeface/`.

Format yang dibutuhkan:
- `model.json` dan berkas shard (.bin) yang dirujuk oleh `model.json`.

Cara mendapatkan model (manual):
1. Coba unduh model prebuilt dari penyimpanan publik (contoh):
   - https://storage.googleapis.com/tfjs-models/savedmodel/blazeface/model.json
2. Simpan `model.json` dan file `.bin` terkait di `model/blazeface/`.
3. Buka halaman dan script akan mencoba memuat `model/blazeface/model.json` terlebih dahulu.

Opsi otomatis:
- Gunakan `download_blazeface_model.sh` (jika tersedia) untuk mencoba mengunduh model secara otomatis.

Catatan:
- Jika model tidak tersedia di folder lokal, aplikasi akan fallback ke model CDN melalui `blazeface.load()`.
