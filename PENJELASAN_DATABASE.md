# 📌 Penjelasan Lengkap: Mengapa Database di Workbench Berbeda dengan Dokumen / Ekspektasi

Dokumen ini dibuat untuk menjawab pertanyaan Anda mengenai perbedaan struktur tabel di **MySQL Workbench**, asal-usul skema database tersebut, serta alasan munculnya respon `Endpoint tidak ditemukan.` di port 5000.

---

## 1. Perbedaan Skema: Dokumen (`ERD.md`) vs MySQL Workbench (`rentifa_db`)

Di dalam proyek Rentifa, terdapat dua versi struktur:

### A. Versi Dokumen (`docs/ERD.md`)
Dokumen ERD yang ada di folder docs ditulis dengan penamaan bahasa Indonesia yang ringkas:
* `pengguna`
* `kategori`
* `kendaraan`
* `reservasi` / `pemesanan`
* `pembayaran`

---

### B. Versi yang Ditemukan di MySQL Workbench (`rentifa_db`)
Di database MySQL lokal komputer Anda (`localhost:3306`, user: `root`, database: `rentifa_db`), tabel-tabel yang ada bernama **Bahasa Inggris** dengan struktur relasi yang jauh lebih lengkap dan ternormalisasi:
1. **`users`**: Menyimpan email, password hash, role (`admin` / `customer`), status aktif.
2. **`customer_profiles`**: Menyimpan profil pelanggan (nama lengkap, nomor HP, alamat, kota) yang terhubung ke `users`.
3. **`vehicle_categories`**: Menyimpan kategori (City Car, Mobil MPV, Mobil SUV, Motor Matic, Motor Sport).
4. **`vehicles`**: Menyimpan detail spesifikasi teknis unit (plat, merk, model, transmisi, bahan bakar, harga harian, deposit).
5. **`vehicle_images`**: Menyimpan galeri foto tiap armada (`is_primary` untuk foto sampul).
6. **`amenities` & `vehicle_amenities`**: Menyimpan fasilitas unit kendaraan.
7. **`bookings`**: Menyimpan transaksi pemesanan lengkap dengan nomor booking (`BK-...`), snapshot harga, tanggal sewa, status pengajuan, dan log catatan.
8. **`booking_status_logs`**: Mencatat riwayat perpindahan status booking (audit trail).
9. **`payments`**: Tabel pembayaran yang dibuat agar mendukung modul pelaporan keuangan di PRD & ERD.

---

## 2. Dari Mana Asal Tabel-Tabel Bahasa Inggris Tersebut?

Berdasarkan pemeriksaan metadata MySQL lokal:
* Tabel-tabel tersebut (**`users`**, **`vehicle_categories`**, **`vehicles`**, dll.) **sudah ada di MySQL Anda sebelum percakapan/pengerjaan ini dimulai**.
* Timestamp pembuatan tabel di MySQL menunjukkan:
  * `vehicle_categories` dibuat pada: `08 November 2026, pukul 15:58:38`
  * `vehicles` dibuat pada: `08 November 2026, pukul 21:19:46`
* Data kategori yang ada di dalamnya pun sudah terisi 5 kategori: *City Car, Mobil MPV, Mobil SUV, Motor Matic, Motor Sport*.

> **Kesimpulan:** Database `rentifa_db` sebelumnya sudah pernah dibuat atau diimpor dengan arsitektur produksi (bahasa Inggris), sementara file `docs/ERD.md` merupakan dokumen ringkasan konseptual awal dalam bahasa Indonesia.

---

## 3. Mengapa Tampilan di Workbench Anda Bisa Terlihat Berbeda?

Jika apa yang Anda lihat di MySQL Workbench saat ini berbeda (misalnya tabel tidak muncul atau jumlah data berbeda):

1. **Workbench Belum Di-Refresh (Paling Sering Terjadi):**
   * Di panel **Navigator > Schemas** di sebelah kiri MySQL Workbench, klik tombol **Refresh** (ikon panah melingkar kecil) di sebelah tulisan `SCHEMAS`.
   * MySQL Workbench tidak selalu memperbarui tampilan daftar tabel secara otomatis ketika ada data atau tabel baru.

2. **Koneksi / Instance MySQL Berbeda:**
   * Backend terhubung ke `localhost:3306` dengan user `root` dan password `Akufar1s_`.
   * Pastikan tab koneksi yang dibuka di Workbench mengarah ke port **3306** yang sama (bukan port MySQL lain seperti 3307 dari XAMPP/MariaDB atau Docker).

3. **Tabel Baru yang Ditambahkan Hari Ini:**
   * Ditambahkan tabel **`payments`** untuk menghubungkan pemesanan dengan pencatatan pembayaran (sesuai ERD).
   * Ditambahkan data seed: 2 akun (`admin@rentifa.com` dan `budi@gmail.com`), beberapa unit kendaraan, dan 1 riwayat transaksi contoh.

---

## 4. Kenapa `http://localhost:5000` Mengeluarkan `{"success":false,"message":"Endpoint tidak ditemukan."}`?

Hal ini **bukan error**, melainkan perilaku normal dari server Express API:

* Port `5000` adalah **Server Backend REST API**, bukan halaman web antarmuka.
* Semua rute API yang aktif dirancang menggunakan awalan **`/api/...`**, contohnya:
  * `http://localhost:5000/api/health` -> Menampilkan status server OK
  * `http://localhost:5000/api/vehicles` -> Menampilkan data JSON katalog kendaraan
  * `http://localhost:5000/api/vehicles/categories` -> Menampilkan data JSON kategori
  * `http://localhost:5000/api/bookings/tracking/BK-20261109-001` -> Menampilkan data JSON booking
* Ketika Anda membuka `http://localhost:5000/` langsung di browser tanpa prefix `/api/...`, Express tidak menemukan rute tampilan di URL tersebut, sehingga masuk ke handler 404 dan menampilkan respon JSON:
  ```json
  {
    "success": false,
    "message": "Endpoint tidak ditemukan."
  }
  ```
* Untuk melihat tampilan antarmuka web (UI) Rentifa yang interaktif, buka alamat **Frontend**:
  👉 **http://localhost:5173**
