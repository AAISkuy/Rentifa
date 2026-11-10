import pool from '../db';
import { UserWithProfile } from '../models/Pengguna';

export class PenggunaRepository {
  static async findByEmail(email: string): Promise<UserWithProfile | null> {
    const [rows]: any = await pool.query(
      `SELECT u.id, u.email, u.password_hash, u.role, u.is_active, u.created_at, u.updated_at,
              cp.full_name, cp.phone_number, cp.address, cp.city
       FROM users u
       LEFT JOIN customer_profiles cp ON u.id = cp.user_id
       WHERE u.email = ? LIMIT 1`,
      [email]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  static async findById(id: number): Promise<UserWithProfile | null> {
    const [rows]: any = await pool.query(
      `SELECT u.id, u.email, u.role, u.is_active, u.created_at, u.updated_at,
              cp.full_name, cp.phone_number, cp.address, cp.city
       FROM users u
       LEFT JOIN customer_profiles cp ON u.id = cp.user_id
       WHERE u.id = ? LIMIT 1`,
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  static async createWithProfile(data: {
    email: string;
    passwordHash: string;
    fullName: string;
    phoneNumber: string;
    role?: 'customer' | 'admin';
  }): Promise<UserWithProfile> {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [userResult]: any = await connection.query(
        `INSERT INTO users (email, password_hash, role, is_active, created_at, updated_at)
         VALUES (?, ?, ?, 1, NOW(), NOW())`,
        [data.email, data.passwordHash, data.role || 'customer']
      );

      const userId = userResult.insertId;

      await connection.query(
        `INSERT INTO customer_profiles (user_id, full_name, phone_number, created_at, updated_at)
         VALUES (?, ?, ?, NOW(), NOW())`,
        [userId, data.fullName, data.phoneNumber]
      );

      await connection.commit();

      const user = await this.findById(userId);
      return user!;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async updateProfile(
    userId: number,
    data: { full_name?: string; phone_number?: string; address?: string; city?: string }
  ): Promise<UserWithProfile | null> {
    const updates: string[] = [];
    const values: any[] = [];

    if (data.full_name !== undefined) {
      updates.push('full_name = ?');
      values.push(data.full_name);
    }
    if (data.phone_number !== undefined) {
      updates.push('phone_number = ?');
      values.push(data.phone_number);
    }
    if (data.address !== undefined) {
      updates.push('address = ?');
      values.push(data.address);
    }
    if (data.city !== undefined) {
      updates.push('city = ?');
      values.push(data.city);
    }

    if (updates.length > 0) {
      values.push(userId);
      await pool.query(
        `UPDATE customer_profiles SET ${updates.join(', ')}, updated_at = NOW() WHERE user_id = ?`,
        values
      );
    }

    return this.findById(userId);
  }

  static async getAll(): Promise<UserWithProfile[]> {
    const [rows]: any = await pool.query(
      `SELECT u.id, u.email, u.role, u.is_active, u.created_at,
              cp.full_name, cp.phone_number, cp.address, cp.city
       FROM users u
       LEFT JOIN customer_profiles cp ON u.id = cp.user_id
       ORDER BY u.created_at DESC`
    );
    return rows;
  }
}
