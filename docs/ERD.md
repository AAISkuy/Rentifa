
# Entity Relationship Diagram (ERD) & Database Schema

Skema relasi database `rentifa_db` dirancang dengan tabel-tabel utama sebagai berikut:

## 1. Tabel `pengguna` (Users)

- `id` (INT, PK, Auto Increment)
- `nama_lengkap` (VARCHAR)
- `email` (VARCHAR, Unique)
- `password` (VARCHAR, Hashed with bcrypt)
- `role` (ENUM: 'customer', 'admin', 'super_admin')
- `no_telepon` (VARCHAR)
- `created_at` (TIMESTAMP)

## 2. Tabel `kategori` (Categories)

- `id` (INT, PK, Auto Increment)
- `category_name` (VARCHAR) -- Contoh: City Car, Mobil MPV, Mobil SUV, Motor Matic, Motor Sport

## 3. Tabel `kendaraan` (Vehicles)

- `id` (INT, PK, Auto Increment)
- `category_id` (INT, FK ke `kategori.id`)
- `brand` (VARCHAR) -- Contoh: Toyota, Honda, Yamaha
- `model` (VARCHAR) -- Contoh: Avanza, Brio, NMAX
- `nomor_plat` (VARCHAR, Unique)
- `tahun_produksi` (INT)
- `tipe_transmisi` (VARCHAR) -- Automatic / Manual
- `kapasitas_penumpang` (INT)
- `bahan_bakar` (VARCHAR)
- `daily_rate` (DECIMAL) -- Harga sewa per hari
- `status` (ENUM: 'tersedia', 'disewa', 'perawatan')
- `image_url` (VARCHAR)
- `deskripsi` (TEXT)

## 4. Tabel `reservasi` / `pemesanan` (Rentals / Bookings)

- `id` (INT, PK, Auto Increment)
- `kode_booking` (VARCHAR, Unique) -- Contoh: #BK-20250512-001
- `pengguna_id` (INT, FK ke `pengguna.id`)
- `kendaraan_id` (INT, FK ke `kendaraan.id`)
- `tanggal_mulai` (DATE)
- `tanggal_selesai` (DATE)
- `total_harga` (DECIMAL)
- `status_pengajuan` (ENUM: 'pending', 'disetujui', 'sedang_berjalan', 'selesai', 'dibatalkan')
- `created_at` (TIMESTAMP)

## 5. Tabel `pembayaran` (Payments)

- `id` (INT, PK, Auto Increment)
- `reservasi_id` (INT, FK ke `reservasi.id`)
- `metode_pembayaran` (VARCHAR) -- QRIS, BCA VA, Mandiri VA, Tunai, Kartu Kredit
- `nominal` (DECIMAL)
- `status_pembayaran` (ENUM: 'pending', 'paid', 'failed')
- `waktu_bayar` (TIMESTAMP)
