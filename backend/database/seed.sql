-- ============================================================
-- RENTIFA MASTER DATA & SAMPLE SEED
-- File: database/seed.sql
-- Description: Data master kategori, fasilitas, armada kendaraan,
--              serta sample reservasi & pembayaran awal
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Kategori Kendaraan
INSERT INTO vehicle_categories (id, name, type, slug, description, icon) VALUES
(1, 'City Car', 'car', 'city-car', 'Mobil kompak lincah dan hemat bahan bakar untuk perkotaan', 'car'),
(2, 'Mobil MPV', 'car', 'mobil-mpv', 'Mobil keluarga lapang 7 penumpang dengan kenyamanan maksimal', 'users'),
(3, 'Mobil SUV', 'car', 'mobil-suv', 'Mobil tangguh dan gagah bertenaga besar untuk segala medan', 'shield'),
(4, 'Motor Matic', 'motorcycle', 'motor-matic', 'Skuter matik praktis dan hemat untuk mobilitas harian', 'zap'),
(5, 'Motor Sport', 'motorcycle', 'motor-sport', 'Motor bertenaga tinggi dengan performa dan desain sporty', 'activity')
ON DUPLICATE KEY UPDATE 
  name = VALUES(name),
  type = VALUES(type),
  description = VALUES(description),
  icon = VALUES(icon);

-- 2. Data Fasilitas (Amenities)
INSERT INTO amenities (id, name, icon, category_type) VALUES
(1, 'Air Conditioner (AC)', 'wind', 'car'),
(2, 'Audio Bluetooth & USB', 'music', 'all'),
(3, 'GPS Navigation', 'map-pin', 'all'),
(4, 'Dashcam Front & Rear', 'video', 'car'),
(5, '2 Helm SNI & Jas Hujan', 'shield', 'motorcycle')
ON DUPLICATE KEY UPDATE 
  name = VALUES(name),
  icon = VALUES(icon),
  category_type = VALUES(category_type);

-- 3. Data Armada Kendaraan
INSERT INTO vehicles (
  id, category_id, license_plate, brand, model, year, color,
  transmission, fuel_type, seating_capacity, luggage_capacity,
  daily_rate, security_deposit, status, description,
  created_at, updated_at
) VALUES
(
  1, 1, 'B 2341 BR', 'Honda', 'Brio RS', 2023, 'Kuning',
  'automatic', 'gasoline', 5, 2,
  300000.00, 500000.00, 'available',
  'City car kompak, gesit, dan sangat irit bahan bakar untuk keliling kota.',
  NOW(), NOW()
),
(
  2, 2, 'B 1234 RENT', 'Toyota', 'All New Avanza', 2023, 'Hitam Metalik',
  'manual', 'gasoline', 7, 3,
  350000.00, 500000.00, 'available',
  'Mobil keluarga idaman 7 penumpang, nyaman, suspensi empuk, dan bagasi lapang.',
  NOW(), NOW()
),
(
  3, 3, 'B 5678 PJR', 'Mitsubishi', 'Pajero Sport Dakar', 2024, 'Putih Mutiara',
  'automatic', 'diesel', 7, 4,
  750000.00, 1000000.00, 'available',
  'SUV gagah bertenaga diesel turbo tangguh untuk segala medan dan perjalanan jauh.',
  NOW(), NOW()
),
(
  4, 4, 'B 8901 NMX', 'Yamaha', 'All New NMAX 155 Connected', 2024, 'Abu-Abu Matte',
  'automatic', 'gasoline', 2, 1,
  130000.00, 200000.00, 'available',
  'Skuter matik premium dengan posisi berkendara rileks, bagasi luas, dan fitur canggih.',
  NOW(), NOW()
),
(
  5, 5, 'B 4321 CBR', 'Honda', 'CBR 150R ABS', 2023, 'Merah Racing',
  'manual', 'gasoline', 2, 0,
  175000.00, 300000.00, 'available',
  'Motor sport full fairing dengan akselerasi responsif dan tampilan agresif.',
  NOW(), NOW()
)
ON DUPLICATE KEY UPDATE 
  category_id = VALUES(category_id),
  brand = VALUES(brand),
  model = VALUES(model),
  year = VALUES(year),
  daily_rate = VALUES(daily_rate),
  security_deposit = VALUES(security_deposit),
  status = VALUES(status),
  description = VALUES(description),
  updated_at = NOW();

-- 4. Foto Kendaraan
INSERT INTO vehicle_images (id, vehicle_id, image_url, caption, is_primary, display_order, created_at) VALUES
(1, 1, 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80', 'Honda Brio RS Front View', 1, 1, NOW()),
(2, 2, 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80', 'Toyota Avanza Front View', 1, 1, NOW()),
(3, 3, 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80', 'Pajero Sport Dakar Front View', 1, 1, NOW()),
(4, 4, 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80', 'Yamaha NMAX Front View', 1, 1, NOW()),
(5, 5, 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80', 'Honda CBR 150R Front View', 1, 1, NOW())
ON DUPLICATE KEY UPDATE 
  image_url = VALUES(image_url),
  caption = VALUES(caption),
  is_primary = VALUES(is_primary);

-- 5. Relasi Fasilitas Kendaraan
INSERT INTO vehicle_amenities (vehicle_id, amenity_id) VALUES
(1, 1), (1, 2), (1, 3),
(2, 1), (2, 2), (2, 3),
(3, 1), (3, 2), (3, 3), (3, 4),
(4, 3), (4, 5),
(5, 3), (5, 5)
ON DUPLICATE KEY UPDATE vehicle_id = VALUES(vehicle_id);

-- 6. Sample Booking & Payment Awal
INSERT INTO bookings (
  id, booking_code, customer_id, vehicle_id, start_date, end_date,
  duration_days, daily_rate_snapshot, rental_subtotal,
  security_deposit_snapshot, grand_total, booking_status,
  hold_expires_at, identity_check_status, customer_notes,
  created_at, updated_at
) VALUES (
  1,
  'BK-20261109-001',
  2,
  1,
  CURDATE(),
  DATE_ADD(CURDATE(), INTERVAL 3 DAY),
  3,
  300000.00,
  900000.00,
  500000.00,
  1400000.00,
  'confirmed',
  DATE_ADD(NOW(), INTERVAL 2 HOUR),
  'valid',
  'Pemesanan sewa Honda Brio untuk keperluan liburan keluarga.',
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE 
  booking_status = VALUES(booking_status),
  updated_at = NOW();

INSERT INTO payments (
  id, booking_id, payment_method, amount, payment_status, paid_at, created_at
) VALUES (
  1,
  1,
  'BCA Virtual Account',
  1400000.00,
  'paid',
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE 
  payment_status = VALUES(payment_status),
  paid_at = VALUES(paid_at);

INSERT INTO booking_status_logs (
  id, booking_id, event_type, previous_status, new_status,
  changed_by_user_id, notes, created_at
) VALUES (
  1,
  1,
  'admin_confirmation',
  'pending_confirmation',
  'confirmed',
  1,
  'Disetujui otomatis oleh sistem demo Rentifa',
  NOW()
)
ON DUPLICATE KEY UPDATE 
  new_status = VALUES(new_status),
  notes = VALUES(notes);

SET FOREIGN_KEY_CHECKS = 1;
