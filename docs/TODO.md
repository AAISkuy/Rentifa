# 📋 Project TODO & Implementation Roadmap

## Phase 1: Database & Backend Setup (`/backend`)

- [x] Konfigurasi file `.env` untuk koneksi database MySQL (`rentifa_db`)
- [x] Implementasi koneksi database di `src/db.ts`
- [x] Membuat migrasi database & seed data awal untuk tabel `pengguna`, `kategori`, dan `kendaraan`
- [x] Menyusun model TypeScript di `src/models/` (`Pengguna.ts`, `Kendaraan.ts`, `Reservasi.ts`)
- [x] Menyusun repository logic di `src/repository/` (`Pengguna.ts`, `Kendaraan.ts`, `Reservasi.ts`)
- [x] Membuat controller & route untuk autentikasi (`Pengguna.ts`) dengan `bcryptjs` & JWT
- [x] Membuat controller & route untuk CRUD Kendaraan (`Kendaraan.ts`)
- [x] Menyiapkan middleware auth JWT & error handling di `src/middleware/`
- [x] Testing endpoint API (Auth, Vehicles, Bookings, Healthcheck)

## Phase 2: Frontend API Integration (`/frontend`)

- [x] Setup base API client dengan Fetch di `src/api/Client.ts`
- [x] Menghubungkan fungsi API untuk auth (`src/api/Pengguna.ts`) dan kendaraan/booking (`src/api/Kendaraan.ts`)
- [x] Mengatur state management autentikasi (AuthContext & LocalStorage)

## Phase 3: Frontend UI Pages & Components (Sesuai Desain Stitch & Brand System)

- [x] **Auth Pages:** Implementasi halaman Login (`HalamanLogin.tsx`) & Register (`HalamanRegister.tsx`) dengan demo login cepat
- [x] **Public Catalog:** Pembuatan halaman utama katalog kendaraan dengan filter kategori (Mobil/Motor) & pencarian (`HalamanBeranda.tsx`)
- [x] **Detail & Booking Page:** Halaman detail unit lengkap dengan kalkulator otomatis durasi sewa & tombol ajukan booking (`HalamanDetail.tsx`)
- [x] **Status Booking Page:** Halaman tracking status reservasi pengguna (`#BK-...`) dengan indikator tahapan alur (`HalamanTracking.tsx`)
- [x] **Customer Orders:** Halaman riwayat pesanan sewa pelanggan (`HalamanPesananSaya.tsx`)
- [x] **Admin Dashboard Layout:** Layout admin responsif (`LayoutAdmin.tsx`, `Header.tsx`, `SideBar.tsx`)
- [x] **Admin Booking Management:** Tabel manajemen pesanan & tombol aksi verifikasi (`HalamanBooking.tsx`)
- [x] **Admin Payment & Revenue:** Halaman laporan keuangan dan ringkasan pembayaran (`Beranda.tsx`)
- [x] **Admin Add/Edit Vehicle Modal:** Implementasi `FormKendaraan.tsx` untuk input dan kelola armada baru
- [x] **Admin Users Management:** Halaman daftar pengguna terdaftar (`HalamanPengguna.tsx`)

## Phase 4: Testing & Deployment

- [x] End-to-end testing dari alur register/login -> pilih kendaraan -> booking kalkulator -> tracking #BK-... -> verifikasi admin
- [x] TypeScript validation clean (`tsc -b`) & Build production frontend (`npm run build`)
- [x] Final review dan verifikasi kesiapan sistem
