
# Product Requirements Document (PRD) - Rentifa

## 1. Tujuan Proyek

Membangun platform sewa kendaraan digital dengan alur pemesanan transparan, konfirmasi instan, serta dashboard manajemen armada dan keuangan yang komprehensif bagi Administrator.

## 2. Fitur Utama Berdasarkan Desain (UI/UX)

### A. Sisi Pelanggan (Customer)

- **Autentikasi Pengguna (`HalamanLogin.tsx`, `HalamanRegister.tsx`):**
  - Form Login & Register dengan validasi format email, kekuatan kata sandi, dan enkripsi.
  - Opsi masuk cepat (Google / Apple OAuth simulation).
- **Beranda & Katalog Kendaraan (`screen_3.jpg`):**
  - Banner hero interaktif dengan filter pencarian berdasarkan Lokasi, Tanggal Sewa, dan Kategori (Semua, Mobil, Motor).
  - List kartu kendaraan lengkap dengan badge popularitas, kapasitas kursi, transmisi, bahan bakar, dan tarif harian (`daily_rate`).
- **Detail & Kalkulator Booking (`screen_4.jpg`):**
  - Galeri foto unit, tab informasi (Deskripsi, Fasilitas, Syarat Sewa).
  - Pilih Tanggal Sewa (`Mulai Sewa` hingga `Selesai Sewa`) yang otomatis mengkalkulasi durasi dan total biaya harian secara real-time.
- **Status Booking & Tracking (`screen.png`):**
  - Halaman ringkasan pemesanan dengan nomor booking unik (`#BK-YYYYMMDD-XXX`).
  - Indikator status pengajuan (`Menunggu Verifikasi`, `Pending`, `Disetujui`, `Selesai`).
  - Timeline langkah selanjutnya (Persetujuan Admin -> Konfirmasi Pembayaran -> Serah Terima).

### B. Sisi Admin (`LayoutAdmin.tsx`)

- **Booking Management (`screen bookin.jpg`):**
  - Statistik ringkas (Total Booking, Perlu Tindakan/Pending Review, Disetujui, Sedang Berjalan, Selesai/Batal).
  - Tabel interaktif daftar pesanan dengan aksi verifikasi cepat (`Check`, `Cross`, Detail).
- **Payments & Revenue Reports (`screen_payment.jpg`):**
  - Ringkasan pendapatan MTD (Month-to-Date), total terbayar, dan transaksi menunggu bayar.
  - Grafik tren pertumbuhan pendapatan dan distribusi kanal pembayaran (Virtual Account, QRIS, Tunai).
- **Manajemen Kendaraan (`screen_management.jpg`):**
  - Modal Form Tambah Kendaraan Baru (`FormKendaraan.tsx`) untuk input nama, kategori, plat nomor, tahun, transmisi, kapasitas, bahan bakar, harga sewa per hari, dan upload foto unit.
