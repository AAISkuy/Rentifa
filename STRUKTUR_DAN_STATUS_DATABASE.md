# 📊 Analisis Lengkap Tabel Database `rentifa_db`

Dokumen ini menjelaskan daftar seluruh tabel yang ada di dalam database `rentifa_db` selain tabel `vehicles`, fungsinya masing-masing, serta tabel mana saja yang **belum/tidak terpakai**.

> ⚠️ **Catatan:** Sesuai permintaan, dokumen ini hanya bersifat penjelasan/audit dan **tidak ada perubahan** yang dilakukan pada struktur maupun data database.

---

## 1. Daftar Tabel di `rentifa_db` (Selain `vehicles`)

Total ada **9 tabel lain** di dalam database `rentifa_db`:

| No | Nama Tabel | Jumlah Data Saat Ini | Fungsi Utama | Status Penggunaan |
|:---|:---|:---:|:---|:---:|
| 1 | `users` | 3 baris | Akun login (Email, Password Hash, Role `admin`/`customer`) | ✅ **Aktif Digunakan** |
| 2 | `customer_profiles` | 3 baris | Profil data diri pengguna (Nama lengkap, No HP, Alamat, Kota) | ✅ **Aktif Digunakan** |
| 3 | `vehicle_categories` | 5 baris | Master kategori (City Car, Mobil MPV, SUV, Motor Matic, Sport) | ✅ **Aktif Digunakan** |
| 4 | `vehicle_images` | 6 baris | Galeri foto tiap unit armada dan penanda foto utama (`is_primary`) | ✅ **Aktif Digunakan** |
| 5 | `bookings` | 2 baris | Transaksi sewa (Kode booking, tanggal, tarif, total, status) | ✅ **Aktif Digunakan** |
| 6 | `payments` | 2 baris | Data pembayaran (Metode bayar, nominal, status bayar `paid`/`pending`) | ✅ **Aktif Digunakan** |
| 7 | `booking_status_logs` | 6 baris | Catatan riwayat/audit trail perpindahan status booking | ⚠️ **Terisi Otomatis, Tapi Belum Ditampilkan di UI** |
| 8 | `amenities` | 8 baris | Master daftar fasilitas (AC, Bluetooth, GPS, Helm SNI, Jas Hujan, dll) | ⚠️ **Menganggur (Belum Tertaut ke Kendaraan)** |
| 9 | `vehicle_amenities` | 0 baris | Tabel relasi many-to-many antara kendaraan dan fasilitas | ❌ **TIDAK TERPAKAI (Kosong 0 baris)** |

---

## 2. Penjelasan Detail Tabel yang "Tidak / Belum Terpakai"

### ❌ A. Tabel `vehicle_amenities` (BENAR-BENAR TIDAK TERPAKAI)
* **Kondisi:** Saat ini memiliki **0 baris data (kosong)**.
* **Tujuan Awalnya:** Dibuat sebagai tabel perantara (*junction table*) untuk merelasikan unit mobil/motor dengan fasilitas yang dimilikinya (misal: Unit Avanza ID 1 memiliki fasilitas ID 1 dan ID 2).
* **Kenapa Tidak Terpakai Saat Ini:**
  * Di aplikasi web Rentifa saat ini, informasi fasilitas kendaraan dimasukkan secara langsung melalui teks deskripsi di tabel `vehicles` (kolom `description`).
  * Belum ada fitur checklist fasilitas saat admin menambah/mengedit kendaraan di dashboard, sehingga tabel penghubung ini dibiarkan kosong dan belum disentuh oleh query aplikasi.

---

### ⚠️ B. Tabel `amenities` (MENGANGGUR / STANDBY)
* **Kondisi:** Berisi **8 baris data master fasilitas**:
  1. *AC Dingin Double Blower* (Car)
  2. *Bluetooth Audio & USB Port* (All)
  3. *Dual SRS Airbag* (Car)
  4. *GPS Tracker Aktif* (All)
  5. *Kamera Parkir Mundur* (Car)
  6. *2 Helm Standar SNI* (Motorcycle)
  7. *Jas Hujan 2 Pasang* (Motorcycle)
  8. *Phone Holder Dashboard* (All)
* **Kenapa Kurang Terpakai:** Karena tabel penghubungnya (`vehicle_amenities`) belum diisi, data fasilitas ini hanya tersimpan sebagai data master di database dan belum terhubung ke unit mobil/motor mana pun.

---

### ⚠️ C. Tabel `booking_status_logs` (HANYA LOG SISTEM)
* **Kondisi:** Berisi **6 baris data log perubahan status**.
* **Fungsi:** Setiap kali admin menyetujui, memulai sewa, atau menyelesaikan sewa, backend mencatat siapa yang mengubah, status sebelumnya, dan status barunya.
* **Kenapa Dikatakan Belum Optimal:** Data ini tersimpan dengan baik di database untuk keperluan riwayat/audit, tetapi di antarmuka web (Frontend) belum ada tabel khusus yang menampilkan log riwayat ini kepada admin maupun customer.

---

### ⚠️ D. Kolom-Kolom "Tidur" di Tabel `bookings`
Di dalam tabel `bookings` sendiri, ada beberapa kolom yang disiapkan untuk fitur verifikasi mendalam namun belum digunakan oleh form web saat ini:
* `hold_extension_count` (perpanjangan waktu hold tiket)
* `identity_checked_by` & `identity_checked_at` (verifikator KTP)
* `identity_check_notes` (catatan verifikasi identitas)
* `rejection_reason` (alasan pembatalan spesifik)

---

## 3. Rekomendasi Tindakan Selanjutnya

Karena Anda meminta **tidak mengubah apa pun saat ini**, status tabel-tabel di atas **tetap aman dibiarkan apa adanya**:

1. **Tidak merusak sistem:** Keberadaan tabel `amenities` dan `vehicle_amenities` yang kosong tidak mengganggu operasional fitur utama (Katalog, Booking, Tracking, dan Admin Dashboard).
2. **Bisa dimanfaatkan di masa depan:** Jika nantinya Anda ingin menambahkan fitur checklist fasilitas (misal: "Centang fasilitas unit: AC, GPS, Helm") atau riwayat audit trail di halaman admin, skema database sudah siap tanpa perlu membuat tabel baru lagi dari nol.
