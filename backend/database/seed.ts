import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

async function seed() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'rentifa_db',
    waitForConnections: true,
    connectionLimit: 10,
  });

  console.log('Connecting to database...');

  // 1. Ensure payments table exists
  await pool.query(`
    CREATE TABLE IF NOT EXISTS payments (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      booking_id BIGINT UNSIGNED NOT NULL,
      payment_method VARCHAR(50) NOT NULL,
      amount DECIMAL(12,2) NOT NULL,
      payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
      paid_at DATETIME NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
    );
  `);
  console.log('Table payments verified/created.');

  // 2. Seed Users
  const [existingUsers] = await pool.query<any[]>('SELECT id, email FROM users');
  let adminId: number;
  let customerId: number;

  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const userPasswordHash = await bcrypt.hash('user123', 10);

  const foundAdmin = existingUsers.find((u) => u.email === 'admin@rentifa.com');
  if (!foundAdmin) {
    const [result]: any = await pool.query(
      `INSERT INTO users (email, password_hash, role, is_active, created_at, updated_at) 
       VALUES (?, ?, 'admin', 1, NOW(), NOW())`,
      ['admin@rentifa.com', adminPasswordHash]
    );
    adminId = result.insertId;
    await pool.query(
      `INSERT INTO customer_profiles (user_id, full_name, phone_number, address, city, created_at, updated_at) 
       VALUES (?, 'Administrator Rentifa', '081234567890', 'Kantor Pusat Rentifa', 'Jakarta', NOW(), NOW())`,
      [adminId]
    );
    console.log('Seeded admin user (admin@rentifa.com / admin123).');
  } else {
    adminId = foundAdmin.id;
  }

  const foundCustomer = existingUsers.find((u) => u.email === 'budi@gmail.com');
  if (!foundCustomer) {
    const [result]: any = await pool.query(
      `INSERT INTO users (email, password_hash, role, is_active, created_at, updated_at) 
       VALUES (?, ?, 'customer', 1, NOW(), NOW())`,
      ['budi@gmail.com', userPasswordHash]
    );
    customerId = result.insertId;
    await pool.query(
      `INSERT INTO customer_profiles (user_id, full_name, phone_number, address, city, created_at, updated_at) 
       VALUES (?, 'Budi Santoso', '085712345678', 'Jl. Sudirman No. 45', 'Jakarta', NOW(), NOW())`,
      [customerId]
    );
    console.log('Seeded customer user (budi@gmail.com / user123).');
  } else {
    customerId = foundCustomer.id;
  }

  // 3. Seed Vehicles & Images
  const [existingVehicles] = await pool.query<any[]>('SELECT id, license_plate FROM vehicles');
  
  const sampleVehicles = [
    {
      category_id: 1, // City Car
      license_plate: 'B 2341 BR',
      brand: 'Honda',
      model: 'Brio RS',
      year: 2023,
      color: 'Kuning',
      transmission: 'automatic',
      fuel_type: 'gasoline',
      seating_capacity: 5,
      luggage_capacity: 2,
      daily_rate: 300000,
      security_deposit: 500000,
      status: 'available',
      description: 'City car kompak, gesit, dan sangat irit bahan bakar untuk keliling kota.',
      imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    },
    {
      category_id: 2, // Mobil MPV
      license_plate: 'B 1234 RENT',
      brand: 'Toyota',
      model: 'All New Avanza',
      year: 2023,
      color: 'Hitam Metalik',
      transmission: 'manual',
      fuel_type: 'gasoline',
      seating_capacity: 7,
      luggage_capacity: 3,
      daily_rate: 350000,
      security_deposit: 500000,
      status: 'available',
      description: 'Mobil keluarga idaman 7 penumpang, nyaman, suspensi empuk, dan bagasi lapang.',
      imageUrl: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80',
    },
    {
      category_id: 3, // Mobil SUV
      license_plate: 'B 5678 PJR',
      brand: 'Mitsubishi',
      model: 'Pajero Sport Dakar',
      year: 2024,
      color: 'Putih Mutiara',
      transmission: 'automatic',
      fuel_type: 'diesel',
      seating_capacity: 7,
      luggage_capacity: 4,
      daily_rate: 750000,
      security_deposit: 1000000,
      status: 'available',
      description: 'SUV gagah bertenaga diesel turbo tangguh untuk segala medan dan perjalanan jauh.',
      imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    },
    {
      category_id: 4, // Motor Matic
      license_plate: 'B 8901 NMX',
      brand: 'Yamaha',
      model: 'All New NMAX 155 Connected',
      year: 2024,
      color: 'Abu-Abu Matte',
      transmission: 'automatic',
      fuel_type: 'gasoline',
      seating_capacity: 2,
      luggage_capacity: 1,
      daily_rate: 130000,
      security_deposit: 200000,
      status: 'available',
      description: 'Skuter matik premium dengan posisi berkendara rileks, bagasi luas, dan fitur canggih.',
      imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
    },
    {
      category_id: 5, // Motor Sport
      license_plate: 'B 4321 CBR',
      brand: 'Honda',
      model: 'CBR 150R ABS',
      year: 2023,
      color: 'Merah Racing',
      transmission: 'manual',
      fuel_type: 'gasoline',
      seating_capacity: 2,
      luggage_capacity: 0,
      daily_rate: 175000,
      security_deposit: 300000,
      status: 'available',
      description: 'Motor sport full fairing dengan akselerasi responsif dan tampilan agresif.',
      imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80',
    },
  ];

  for (const v of sampleVehicles) {
    const exists = existingVehicles.find((ev) => ev.license_plate === v.license_plate);
    let vId: number;
    if (!exists) {
      const [insertRes]: any = await pool.query(
        `INSERT INTO vehicles (category_id, license_plate, brand, model, year, color, transmission, fuel_type, seating_capacity, luggage_capacity, daily_rate, security_deposit, status, description, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          v.category_id,
          v.license_plate,
          v.brand,
          v.model,
          v.year,
          v.color,
          v.transmission,
          v.fuel_type,
          v.seating_capacity,
          v.luggage_capacity,
          v.daily_rate,
          v.security_deposit,
          v.status,
          v.description,
        ]
      );
      vId = insertRes.insertId;
      console.log('Seeded vehicle: ' + v.brand + ' ' + v.model);
    } else {
      vId = exists.id;
    }

    // Check images
    const [imgs] = await pool.query<any[]>('SELECT id FROM vehicle_images WHERE vehicle_id = ?', [vId]);
    if (imgs.length === 0) {
      await pool.query(
        `INSERT INTO vehicle_images (vehicle_id, image_url, caption, is_primary, display_order, created_at)
         VALUES (?, ?, ?, 1, 1, NOW())`,
        [vId, v.imageUrl, `${v.brand} ${v.model} Front View`]
      );
    }
  }

  // 4. Seed sample booking & payment if none exists
  const [bookings] = await pool.query<any[]>('SELECT id FROM bookings LIMIT 1');
  if (bookings.length === 0 && customerId) {
    const [sampleVeh]: any = await pool.query('SELECT id, daily_rate FROM vehicles LIMIT 1');
    if (sampleVeh.length > 0) {
      const v = sampleVeh[0];
      const dailyRate = Number(v.daily_rate);
      const days = 3;
      const subtotal = dailyRate * days;
      const deposit = 500000;
      const grandTotal = subtotal + deposit;

      const [bRes]: any = await pool.query(
        `INSERT INTO bookings (
          booking_code, customer_id, vehicle_id, start_date, end_date, duration_days,
          daily_rate_snapshot, rental_subtotal, security_deposit_snapshot, grand_total,
          booking_status, hold_expires_at, identity_check_status, created_at, updated_at
        ) VALUES (
          'BK-20261109-001', ?, ?, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 3 DAY), ?,
          ?, ?, ?, ?,
          'confirmed', DATE_ADD(NOW(), INTERVAL 2 HOUR), 'valid', NOW(), NOW()
        )`,
        [customerId, v.id, days, dailyRate, subtotal, deposit, grandTotal]
      );

      const bookingId = bRes.insertId;

      await pool.query(
        `INSERT INTO payments (booking_id, payment_method, amount, payment_status, paid_at, created_at)
         VALUES (?, 'BCA Virtual Account', ?, 'paid', NOW(), NOW())`,
        [bookingId, grandTotal]
      );

      await pool.query(
        `INSERT INTO booking_status_logs (booking_id, event_type, previous_status, new_status, changed_by_user_id, notes, created_at)
         VALUES (?, 'admin_confirmation', 'pending_confirmation', 'confirmed', ?, 'Disetujui otomatis oleh sistem demo', NOW())`,
        [bookingId, adminId]
      );

      console.log('Seeded sample booking & payment #BK-20261109-001.');
    }
  }

  console.log('Database seeding completed successfully!');
  await pool.end();
}

seed().catch((err) => {
  console.error('Error seeding database:', err);
  process.exit(1);
});
