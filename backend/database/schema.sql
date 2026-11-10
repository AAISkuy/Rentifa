-- ============================================================
-- RENTIFA DATABASE SCHEMA
-- File: database/schema.sql
-- Description: DDL untuk struktur tabel sistem rental kendaraan
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Tabel Users
CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(191) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'customer') DEFAULT 'customer',
  is_active TINYINT(1) DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tabel Profil Pengguna / Customer
CREATE TABLE IF NOT EXISTS customer_profiles (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  phone_number VARCHAR(30) NOT NULL,
  address TEXT NULL,
  city VARCHAR(100) NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Tabel Kategori Kendaraan
CREATE TABLE IF NOT EXISTS vehicle_categories (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type ENUM('car', 'motorcycle') NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT NULL,
  icon VARCHAR(50) NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Tabel Kendaraan
CREATE TABLE IF NOT EXISTS vehicles (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category_id INT UNSIGNED NOT NULL,
  license_plate VARCHAR(20) NOT NULL UNIQUE,
  brand VARCHAR(50) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INT NOT NULL,
  color VARCHAR(50) NOT NULL,
  transmission ENUM('manual', 'automatic') NOT NULL,
  fuel_type ENUM('gasoline', 'diesel', 'electric', 'hybrid') NOT NULL,
  seating_capacity INT NOT NULL DEFAULT 4,
  luggage_capacity INT NOT NULL DEFAULT 1,
  daily_rate DECIMAL(12,2) NOT NULL,
  security_deposit DECIMAL(12,2) DEFAULT 0,
  status ENUM('available', 'rented', 'maintenance', 'inactive') DEFAULT 'available',
  description TEXT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES vehicle_categories(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Tabel Gambar Kendaraan
CREATE TABLE IF NOT EXISTS vehicle_images (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  vehicle_id INT UNSIGNED NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  caption VARCHAR(255) NULL,
  is_primary TINYINT(1) DEFAULT 0,
  display_order INT DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Tabel Fasilitas (Amenities)
CREATE TABLE IF NOT EXISTS amenities (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(50) NULL,
  category_type ENUM('all', 'car', 'motorcycle') DEFAULT 'all',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Tabel Relasi Kendaraan & Fasilitas
CREATE TABLE IF NOT EXISTS vehicle_amenities (
  vehicle_id INT UNSIGNED NOT NULL,
  amenity_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (vehicle_id, amenity_id),
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
  FOREIGN KEY (amenity_id) REFERENCES amenities(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Tabel Reservasi / Booking
CREATE TABLE IF NOT EXISTS bookings (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  booking_code VARCHAR(50) NOT NULL UNIQUE,
  customer_id INT UNSIGNED NOT NULL,
  vehicle_id INT UNSIGNED NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  duration_days INT NOT NULL,
  daily_rate_snapshot DECIMAL(12,2) NOT NULL,
  rental_subtotal DECIMAL(12,2) NOT NULL,
  security_deposit_snapshot DECIMAL(12,2) NOT NULL,
  grand_total DECIMAL(12,2) NOT NULL,
  booking_status ENUM('pending_confirmation', 'confirmed', 'rejected', 'expired', 'cancelled', 'active_rental', 'completed') DEFAULT 'pending_confirmation',
  hold_expires_at DATETIME NULL,
  hold_extension_count INT DEFAULT 0,
  identity_check_status ENUM('unverified', 'valid', 'invalid') DEFAULT 'unverified',
  identity_checked_by INT UNSIGNED NULL,
  identity_checked_at DATETIME NULL,
  identity_check_notes TEXT NULL,
  rejection_reason TEXT NULL,
  cancellation_reason TEXT NULL,
  customer_notes TEXT NULL,
  admin_notes TEXT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE RESTRICT,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Tabel Pembayaran
CREATE TABLE IF NOT EXISTS payments (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  booking_id BIGINT UNSIGNED NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
  paid_at DATETIME NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Tabel Log Status Reservasi
CREATE TABLE IF NOT EXISTS booking_status_logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  booking_id BIGINT UNSIGNED NOT NULL,
  event_type VARCHAR(50) NOT NULL,
  previous_status VARCHAR(50) NULL,
  new_status VARCHAR(50) NOT NULL,
  changed_by_user_id INT UNSIGNED NULL,
  notes TEXT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
