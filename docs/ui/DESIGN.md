
# UI/UX & Design Guidelines - Rentifa

Dokumentasi ini merangkum acuan desain antarmuka (UI/UX) aplikasi **Rentifa** ("Reliable Rides, Easy Rentals") yang bersumber dari hasil desain di **Stitch**.

## 🎨 1. Design System & Tema Visual

- **Tema Utama:** Modern, Clean, dan Profesional dengan nuansa warna **Dark Emerald / Deep Forest Green** (menggambarkan keamanan, mobilitas, dan kepercayaan).
- **Warna Aksen:** White (`#FFFFFF`), Soft Gray untuk background kontainer, serta Badge warna-warni untuk status (Hijau untuk sukses/tersedia, Kuning/Orange untuk pending, Merah untuk batal/gagal).
- **Tipografi:** Sans-serif modern yang bersih dan mudah dibaca di berbagai ukuran layar (Desktop & Mobile responsive).

---

## 📱 2. Daftar Halaman & Layar Utama (Screen Mapping)

### A. Sisi Pelanggan (Customer)

1. **Halaman Login (`HalamanLogin.tsx` / `screen.jpg`):**
   - Kartu autentikasi terpusat dengan logo Rentifa.
   - Form input Email & Kata Sandi dengan ikon visual.
   - Opsi "Ingat saya" & "Lupa kata sandi?".
   - Tombol masuk cepat via Google & Apple.
2. **Halaman Register (`HalamanRegister.tsx` / `screen_2.jpg`):**
   - Form pendaftaran lengkap (Nama sesuai KTP/SIM, Email, Password dengan indikator kekuatan sandi, Konfirmasi Password).
   - Checkbox persetujuan Syarat & Ketentuan.
3. **Beranda & Katalog (`screen_3.jpg`):**
   - Banner hero dengan gambar kendaraan & tagline utama.
   - Bar pencarian cepat berdasarkan *Lokasi* dan *Tanggal Sewa*.
   - Filter kategori (Semua, Mobil, Motor) & tombol filter lanjutan.
   - Kartu grid unit kendaraan dengan info kapasitas kursi, transmisi, bahan bakar, badge populer/premium, dan harga per hari (`daily_rate`).
4. **Detail Kendaraan & Kalkulator Booking (`screen_4.jpg`):**
   - Galeri foto unit dengan thumbnail navigasi.
   - Tab informasi (Deskripsi, Fasilitas, Syarat Sewa).
   - Panel kalkulator sewa interaktif (Pilih tanggal mulai & selesai, otomatis menghitung durasi hari dan total harga).
5. **Status Booking (`screen.png`):**
   - Halaman konfirmasi dengan nomor unik pemesanan (`#BK-YYYYMMDD-XXX`).
   - Indikator status pengajuan (Pending / Menunggu Verifikasi).
   - Timeline langkah selanjutnya (Persetujuan Admin -> Pembayaran -> Serah Terima).

### B. Sisi Admin (`LayoutAdmin.tsx`)

1. **Booking Management (`screen bookin.jpg`):**
   - Statistik kartu ringkasan (Total Booking, Perlu Tindakan, Disetujui, Sedang Berjalan, Selesai/Batal).
   - Tabel interaktif daftar pesanan dengan informasi penyewa, unit armada, durasi, total pembayaran, status, dan tombol aksi verifikasi cepat (Check/Cross/Detail).
   - Tombol Export CSV & filter lanjutan.
2. **Payments & Revenue Reports (`screen_payment.jpg`):**
   - Ringkasan pendapatan MTD (Month-to-Date), total terbayar, dan transaksi menunggu.
   - Grafik tren pertumbuhan pendapatan (Mobil vs Motor) dan distribusi kanal pembayaran (Virtual Account, QRIS, Tunai).
   - Daftar riwayat & log transaksi keuangan.
3. **Manajemen Kendaraan & Modal Tambah Unit (`screen_management.jpg`):**
   - Modal form untuk menambah armada baru (`FormKendaraan.tsx`) meliputi nama kendaraan, kategori (Mobil/Motor), status awal, plat nomor, tahun produksi, transmisi, kapasitas, bahan bakar, harga sewa per hari, area upload foto utama, dan deskripsi fasilitas unggulan.
