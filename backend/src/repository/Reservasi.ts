import pool from '../db';
import { Booking, BookingStatus, CreateBookingDTO, Payment } from '../models/Reservasi';

export class ReservasiRepository {
  private static async generateBookingCode(): Promise<string> {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const datePrefix = `BK-${yyyy}${mm}${dd}`;

    const [rows]: any = await pool.query(
      'SELECT booking_code FROM bookings WHERE booking_code LIKE ? ORDER BY id DESC LIMIT 1',
      [`${datePrefix}-%`]
    );

    let nextNumber = 1;
    if (rows.length > 0) {
      const parts = rows[0].booking_code.split('-');
      if (parts.length === 3) {
        nextNumber = parseInt(parts[2], 10) + 1;
      }
    }

    return `${datePrefix}-${String(nextNumber).padStart(3, '0')}`;
  }

  static async createBooking(
    customerId: number,
    dto: CreateBookingDTO
  ): Promise<Booking> {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Fetch vehicle info
      const [vRows]: any = await connection.query(
        'SELECT id, daily_rate, security_deposit, status FROM vehicles WHERE id = ? FOR UPDATE',
        [dto.vehicle_id]
      );
      if (vRows.length === 0) {
        throw new Error('Kendaraan tidak ditemukan');
      }
      const vehicle = vRows[0];
      if (vehicle.status !== 'available') {
        throw new Error('Kendaraan sedang tidak tersedia untuk disewa');
      }

      // 2. Calculate duration and totals
      const start = new Date(dto.start_date);
      const end = new Date(dto.end_date);
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

      const dailyRate = Number(vehicle.daily_rate);
      const rentalSubtotal = dailyRate * diffDays;
      const securityDeposit = Number(vehicle.security_deposit || 0);
      const grandTotal = rentalSubtotal + securityDeposit;

      // 3. Generate booking code
      const bookingCode = await this.generateBookingCode();

      // 4. Insert booking
      const [bRes]: any = await connection.query(
        `INSERT INTO bookings (
          booking_code, customer_id, vehicle_id, start_date, end_date,
          duration_days, daily_rate_snapshot, rental_subtotal,
          security_deposit_snapshot, grand_total, booking_status,
          hold_expires_at, identity_check_status, customer_notes,
          created_at, updated_at
        ) VALUES (
          ?, ?, ?, ?, ?,
          ?, ?, ?,
          ?, ?, 'pending_confirmation',
          DATE_ADD(NOW(), INTERVAL 2 HOUR), 'unverified', ?,
          NOW(), NOW()
        )`,
        [
          bookingCode,
          customerId,
          dto.vehicle_id,
          dto.start_date,
          dto.end_date,
          diffDays,
          dailyRate,
          rentalSubtotal,
          securityDeposit,
          grandTotal,
          dto.customer_notes || null,
        ]
      );

      const bookingId = bRes.insertId;

      // 5. Insert payment record
      await connection.query(
        `INSERT INTO payments (
          booking_id, payment_method, amount, payment_status, created_at
        ) VALUES (?, ?, ?, 'pending', NOW())`,
        [bookingId, dto.payment_method || 'Virtual Account BCA', grandTotal]
      );

      // 6. Log status
      await connection.query(
        `INSERT INTO booking_status_logs (
          booking_id, event_type, previous_status, new_status,
          changed_by_user_id, notes, created_at
        ) VALUES (?, 'status_change', 'none', 'pending_confirmation', ?, 'Pengajuan reservasi dibuat oleh pelanggan', NOW())`,
        [bookingId, customerId]
      );

      await connection.commit();

      const booking = await this.getByCode(bookingCode);
      return booking!;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  static async getByCode(bookingCode: string): Promise<Booking | null> {
    const [rows]: any = await pool.query(
      `SELECT b.*,
              cp.full_name AS customer_name,
              u.email AS customer_email,
              cp.phone_number AS customer_phone,
              v.brand AS vehicle_brand,
              v.model AS vehicle_model,
              v.license_plate AS vehicle_license_plate,
              vc.type AS vehicle_type,
              vi.image_url AS vehicle_image,
              p.payment_status,
              p.payment_method
       FROM bookings b
       JOIN users u ON b.customer_id = u.id
       LEFT JOIN customer_profiles cp ON u.id = cp.user_id
       JOIN vehicles v ON b.vehicle_id = v.id
       JOIN vehicle_categories vc ON v.category_id = vc.id
       LEFT JOIN vehicle_images vi ON v.id = vi.vehicle_id AND vi.is_primary = 1
       LEFT JOIN payments p ON b.id = p.booking_id
       WHERE b.booking_code = ? LIMIT 1`,
      [bookingCode]
    );

    return rows.length > 0 ? rows[0] : null;
  }

  static async getByCustomerId(customerId: number): Promise<Booking[]> {
    const [rows]: any = await pool.query(
      `SELECT b.*,
              v.brand AS vehicle_brand,
              v.model AS vehicle_model,
              v.license_plate AS vehicle_license_plate,
              vi.image_url AS vehicle_image,
              p.payment_status,
              p.payment_method
       FROM bookings b
       JOIN vehicles v ON b.vehicle_id = v.id
       LEFT JOIN vehicle_images vi ON v.id = vi.vehicle_id AND vi.is_primary = 1
       LEFT JOIN payments p ON b.id = p.booking_id
       WHERE b.customer_id = ?
       ORDER BY b.id DESC`,
      [customerId]
    );
    return rows;
  }

  static async getAll(status?: string): Promise<Booking[]> {
    let sql = `
      SELECT b.*,
             cp.full_name AS customer_name,
             u.email AS customer_email,
             cp.phone_number AS customer_phone,
             v.brand AS vehicle_brand,
             v.model AS vehicle_model,
             v.license_plate AS vehicle_license_plate,
             vi.image_url AS vehicle_image,
             p.payment_status,
             p.payment_method
      FROM bookings b
      JOIN users u ON b.customer_id = u.id
      LEFT JOIN customer_profiles cp ON u.id = cp.user_id
      JOIN vehicles v ON b.vehicle_id = v.id
      LEFT JOIN vehicle_images vi ON v.id = vi.vehicle_id AND vi.is_primary = 1
      LEFT JOIN payments p ON b.id = p.booking_id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (status && status !== 'all') {
      sql += ' AND b.booking_status = ?';
      params.push(status);
    }

    sql += ' ORDER BY b.id DESC';

    const [rows]: any = await pool.query(sql, params);
    return rows;
  }

  static async updateStatus(
    bookingId: number,
    newStatus: BookingStatus,
    adminUserId: number,
    notes?: string
  ): Promise<Booking | null> {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [cur]: any = await connection.query(
        'SELECT booking_status, booking_code, vehicle_id FROM bookings WHERE id = ? FOR UPDATE',
        [bookingId]
      );
      if (cur.length === 0) throw new Error('Booking tidak ditemukan');
      const prevStatus = cur[0].booking_status;

      await connection.query(
        'UPDATE bookings SET booking_status = ?, updated_at = NOW() WHERE id = ?',
        [newStatus, bookingId]
      );

      // If confirmed, update vehicle status if rental is active
      if (newStatus === 'confirmed' || newStatus === 'active_rental') {
        await connection.query("UPDATE vehicles SET status = 'available' WHERE id = ?", [
          cur[0].vehicle_id,
        ]);
        await connection.query(
          "UPDATE payments SET payment_status = 'paid', paid_at = NOW() WHERE booking_id = ?",
          [bookingId]
        );
      } else if (newStatus === 'completed' || newStatus === 'cancelled' || newStatus === 'rejected') {
        await connection.query("UPDATE vehicles SET status = 'available' WHERE id = ?", [
          cur[0].vehicle_id,
        ]);
      }

      await connection.query(
        `INSERT INTO booking_status_logs (
          booking_id, event_type, previous_status, new_status,
          changed_by_user_id, notes, created_at
        ) VALUES (?, 'status_change', ?, ?, ?, ?, NOW())`,
        [bookingId, prevStatus, newStatus, adminUserId, notes || null]
      );

      await connection.commit();
      return this.getByCode(cur[0].booking_code);
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  static async getStats(): Promise<any> {
    const [statusCounts]: any = await pool.query(
      `SELECT booking_status, COUNT(*) as count FROM bookings GROUP BY booking_status`
    );

    const [revenue]: any = await pool.query(
      `SELECT 
         COALESCE(SUM(amount), 0) AS total_revenue,
         COALESCE(SUM(CASE WHEN MONTH(paid_at) = MONTH(CURRENT_DATE()) AND YEAR(paid_at) = YEAR(CURRENT_DATE()) THEN amount ELSE 0 END), 0) AS mtd_revenue
       FROM payments 
       WHERE payment_status = 'paid'`
    );

    const [paymentBreakdown]: any = await pool.query(
      `SELECT payment_method, COUNT(*) as count, COALESCE(SUM(amount), 0) as total
       FROM payments
       GROUP BY payment_method`
    );

    const counts: Record<string, number> = {
      total: 0,
      pending_confirmation: 0,
      confirmed: 0,
      active_rental: 0,
      completed: 0,
      cancelled: 0,
      rejected: 0,
    };

    for (const row of statusCounts) {
      counts[row.booking_status] = row.count;
      counts.total += row.count;
    }

    return {
      counts,
      revenue: revenue[0],
      paymentBreakdown,
    };
  }
}
