import pool from '../db';
import { Vehicle, VehicleCategory, VehicleFilter } from '../models/Kendaraan';

export class KendaraanRepository {
  static async getCategories(): Promise<VehicleCategory[]> {
    const [rows]: any = await pool.query('SELECT * FROM vehicle_categories ORDER BY id ASC');
    return rows;
  }

  static async getAll(filter?: VehicleFilter): Promise<Vehicle[]> {
    let sql = `
      SELECT v.*, 
             vc.name AS category_name, 
             vc.type AS category_type,
             vi.image_url AS primary_image
      FROM vehicles v
      JOIN vehicle_categories vc ON v.category_id = vc.id
      LEFT JOIN vehicle_images vi ON v.id = vi.vehicle_id AND vi.is_primary = 1
      WHERE 1=1
    `;
    const params: any[] = [];

    if (filter?.status) {
      sql += ' AND v.status = ?';
      params.push(filter.status);
    }

    if (filter?.type) {
      sql += ' AND vc.type = ?';
      params.push(filter.type);
    }

    if (filter?.category_id) {
      sql += ' AND v.category_id = ?';
      params.push(filter.category_id);
    }

    if (filter?.transmission) {
      sql += ' AND v.transmission = ?';
      params.push(filter.transmission);
    }

    if (filter?.search) {
      sql += ' AND (v.brand LIKE ? OR v.model LIKE ? OR vc.name LIKE ?)';
      const keyword = `%${filter.search}%`;
      params.push(keyword, keyword, keyword);
    }

    if (filter?.min_price) {
      sql += ' AND v.daily_rate >= ?';
      params.push(filter.min_price);
    }

    if (filter?.max_price) {
      sql += ' AND v.daily_rate <= ?';
      params.push(filter.max_price);
    }

    sql += ' ORDER BY v.id DESC';

    const [rows]: any = await pool.query(sql, params);
    return rows;
  }

  static async getById(id: number): Promise<Vehicle | null> {
    const [rows]: any = await pool.query(
      `SELECT v.*, 
              vc.name AS category_name, 
              vc.type AS category_type,
              vi.image_url AS primary_image
       FROM vehicles v
       JOIN vehicle_categories vc ON v.category_id = vc.id
       LEFT JOIN vehicle_images vi ON v.id = vi.vehicle_id AND vi.is_primary = 1
       WHERE v.id = ? LIMIT 1`,
      [id]
    );

    if (rows.length === 0) return null;
    const vehicle = rows[0];

    // Fetch images
    const [images]: any = await pool.query(
      'SELECT * FROM vehicle_images WHERE vehicle_id = ? ORDER BY is_primary DESC, display_order ASC',
      [id]
    );
    vehicle.images = images;

    // Fetch amenities
    const [amenities]: any = await pool.query(
      `SELECT a.* FROM amenities a
       JOIN vehicle_amenities va ON a.id = va.amenity_id
       WHERE va.vehicle_id = ?`,
      [id]
    );
    vehicle.amenities = amenities;

    return vehicle;
  }

  static async create(data: {
    category_id: number;
    license_plate: string;
    brand: string;
    model: string;
    year: number;
    color: string;
    transmission: 'manual' | 'automatic';
    fuel_type: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
    seating_capacity: number;
    luggage_capacity?: number;
    daily_rate: number;
    security_deposit?: number;
    status?: 'available' | 'maintenance' | 'inactive';
    description?: string;
    image_url?: string;
  }): Promise<Vehicle> {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [res]: any = await connection.query(
        `INSERT INTO vehicles (
          category_id, license_plate, brand, model, year, color,
          transmission, fuel_type, seating_capacity, luggage_capacity,
          daily_rate, security_deposit, status, description,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          data.category_id,
          data.license_plate,
          data.brand,
          data.model,
          data.year,
          data.color,
          data.transmission,
          data.fuel_type,
          data.seating_capacity,
          data.luggage_capacity || 0,
          data.daily_rate,
          data.security_deposit || 0,
          data.status || 'available',
          data.description || '',
        ]
      );

      const vehicleId = res.insertId;

      if (data.image_url) {
        await connection.query(
          `INSERT INTO vehicle_images (vehicle_id, image_url, caption, is_primary, display_order, created_at)
           VALUES (?, ?, ?, 1, 1, NOW())`,
          [vehicleId, data.image_url, `${data.brand} ${data.model}`]
        );
      }

      await connection.commit();

      const created = await this.getById(vehicleId);
      return created!;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  static async update(
    id: number,
    data: Partial<{
      category_id: number;
      license_plate: string;
      brand: string;
      model: string;
      year: number;
      color: string;
      transmission: 'manual' | 'automatic';
      fuel_type: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
      seating_capacity: number;
      luggage_capacity: number;
      daily_rate: number;
      security_deposit: number;
      status: 'available' | 'maintenance' | 'inactive';
      description: string;
      image_url: string;
    }>
  ): Promise<Vehicle | null> {
    const fields: string[] = [];
    const values: any[] = [];

    const allowedKeys: (keyof typeof data)[] = [
      'category_id',
      'license_plate',
      'brand',
      'model',
      'year',
      'color',
      'transmission',
      'fuel_type',
      'seating_capacity',
      'luggage_capacity',
      'daily_rate',
      'security_deposit',
      'status',
      'description',
    ];

    for (const key of allowedKeys) {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(data[key]);
      }
    }

    if (fields.length > 0) {
      values.push(id);
      await pool.query(
        `UPDATE vehicles SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`,
        values
      );
    }

    if (data.image_url) {
      const [imgs]: any = await pool.query(
        'SELECT id FROM vehicle_images WHERE vehicle_id = ? AND is_primary = 1',
        [id]
      );
      if (imgs.length > 0) {
        await pool.query('UPDATE vehicle_images SET image_url = ? WHERE id = ?', [
          data.image_url,
          imgs[0].id,
        ]);
      } else {
        await pool.query(
          `INSERT INTO vehicle_images (vehicle_id, image_url, caption, is_primary, display_order, created_at)
           VALUES (?, ?, 'Primary Image', 1, 1, NOW())`,
          [id, data.image_url]
        );
      }
    }

    return this.getById(id);
  }

  static async delete(id: number): Promise<boolean> {
    // Soft delete by updating status to inactive
    const [res]: any = await pool.query(
      "UPDATE vehicles SET status = 'inactive', updated_at = NOW() WHERE id = ?",
      [id]
    );
    return res.affectedRows > 0;
  }
}
