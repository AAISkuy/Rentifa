
# 🚀 Panduan Menjalankan Proyek Rentifa (Local Development)

Halo! Berikut adalah langkah-langkah untuk menjalankan proyek **Rentifa** di lingkungan local development. Pastikan Anda sudah menginstal **Node.js** dan **MySQL** di komputer Anda.

---

## 1. Konfigurasi Database (MySQL)

1. Buat database baru di MySQL dengan nama: `rentifa_db`
2. Sesuaikan konfigurasi koneksi database pada file `.env` di dalam folder `backend/` jika diperlukan (host, user, password, port).

---

## 2. Menjalankan Backend (Server API)

Buka terminal pertama, lalu arahkan ke folder backend dan jalankan perintah berikut:

cd backend
npm install
npm run dev

> *Catatan: Server backend akan berjalan secara otomatis di port yang ditentukan (biasanya `http://localhost:5000` atau sesuai file `.env`).*

---

## 3. Menjalankan Frontend (Client Web)

Buka terminal **kedua** (biarkan terminal backend tetap menyala), lalu arahkan ke folder frontend dan jalankan perintah berikut:

cd frontend
npm install
npm run dev

> *Catatan: Aplikasi web frontend akan berjalan di browser, biasanya melalui tautan `http://localhost:5173`.*
