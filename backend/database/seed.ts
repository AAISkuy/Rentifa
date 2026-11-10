import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.join(__dirname, '../.env') });

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = Number(process.env.DB_PORT) || 3306;
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'rentifa_db';

async function executeSqlFile(connection: mysql.Connection | mysql.Pool, filePath: string, description: string) {
  console.log(`⏳ [Mengeksekusi] ${description} (${path.basename(filePath)})...`);
  
  if (!fs.existsSync(filePath)) {
    throw new Error(`File tidak ditemukan: ${filePath}`);
  }

  const sqlContent = fs.readFileSync(filePath, 'utf-8');
  await connection.query(sqlContent);
  console.log(`✅ [Selesai] ${description}`);
}

async function runSeed() {
  console.log('🚀 Memulai proses seeding database Rentifa...');
  console.log(`📍 Menghubungkan ke MySQL di ${DB_HOST}:${DB_PORT} (Database: ${DB_NAME})...`);

  // 1. Buat koneksi awal untuk memastikan database sudah ada
  const initConnection = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
  });

  await initConnection.query(
    `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
  );
  await initConnection.end();

  // 2. Buat connection pool dengan multipleStatements: true
  const pool = mysql.createPool({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    multipleStatements: true,
  });

  try {
    // 3. Jalankan file schema.sql (DDL Struktur Tabel)
    const schemaPath = path.join(__dirname, 'schema.sql');
    await executeSqlFile(pool, schemaPath, '1/3 Membuat struktur tabel (schema.sql)');

    // 4. Jalankan file user.sql (DML Data Pengguna Awal)
    const userPath = path.join(__dirname, 'user.sql');
    await executeSqlFile(pool, userPath, '2/3 Mengisi data pengguna & profil (user.sql)');

    // 5. Jalankan file seed.sql (DML Master Data Kendaraan & Transaksi)
    const seedPath = path.join(__dirname, 'seed.sql');
    await executeSqlFile(pool, seedPath, '3/3 Mengisi master kendaraan & sample transaksi (seed.sql)');

    console.log('\n🎉 Seluruh proses seeding database Rentifa BERHASIL!');
    console.log('----------------------------------------------------');
    console.log('Akun Demo yang Siap Digunakan:');
    console.log('  👑 Admin   : admin@rentifa.com / admin123');
    console.log('  👤 Customer: budi@gmail.com    / user123');
    console.log('----------------------------------------------------');
  } catch (error) {
    console.error('❌ Gagal menjalankan seeding database:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runSeed();
