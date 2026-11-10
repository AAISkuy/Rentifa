import { Request, Response, NextFunction } from 'express';
import { KendaraanRepository } from '../repository/Kendaraan';

export class KendaraanController {
  static async getCategories(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await KendaraanRepository.getCategories();
      res.status(200).json({ success: true, data: categories });
    } catch (err) {
      next(err);
    }
  }

  static async getCatalog(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { category_id, type, search, transmission, min_price, max_price, status } = req.query;

      const vehicles = await KendaraanRepository.getAll({
        category_id: category_id ? Number(category_id) : undefined,
        type: type ? (type as 'car' | 'motorcycle') : undefined,
        search: search ? String(search) : undefined,
        transmission: transmission ? (transmission as 'manual' | 'automatic') : undefined,
        min_price: min_price ? Number(min_price) : undefined,
        max_price: max_price ? Number(max_price) : undefined,
        status: status ? String(status) : 'available',
      });

      res.status(200).json({ success: true, data: vehicles });
    } catch (err) {
      next(err);
    }
  }

  static async getAllForAdmin(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const vehicles = await KendaraanRepository.getAll({});
      res.status(200).json({ success: true, data: vehicles });
    } catch (err) {
      next(err);
    }
  }

  static async getDetail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ success: false, message: 'ID kendaraan tidak valid.' });
        return;
      }

      const vehicle = await KendaraanRepository.getById(id);
      if (!vehicle) {
        res.status(404).json({ success: false, message: 'Kendaraan tidak ditemukan.' });
        return;
      }

      res.status(200).json({ success: true, data: vehicle });
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        category_id,
        license_plate,
        brand,
        model,
        year,
        color,
        transmission,
        fuel_type,
        seating_capacity,
        luggage_capacity,
        daily_rate,
        security_deposit,
        description,
        image_url,
      } = req.body;

      if (!category_id || !license_plate || !brand || !model || !daily_rate) {
        res.status(400).json({
          success: false,
          message: 'Kategori, plat nomor, merk, model, dan harga sewa harian wajib diisi.',
        });
        return;
      }

      const vehicle = await KendaraanRepository.create({
        category_id: Number(category_id),
        license_plate,
        brand,
        model,
        year: Number(year) || new Date().getFullYear(),
        color: color || 'Hitam',
        transmission: transmission || 'automatic',
        fuel_type: fuel_type || 'gasoline',
        seating_capacity: Number(seating_capacity) || 4,
        luggage_capacity: Number(luggage_capacity) || 1,
        daily_rate: Number(daily_rate),
        security_deposit: Number(security_deposit) || 0,
        description: description || '',
        image_url: image_url || '',
      });

      res.status(201).json({
        success: true,
        message: 'Kendaraan berhasil ditambahkan!',
        data: vehicle,
      });
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const updated = await KendaraanRepository.update(id, req.body);
      if (!updated) {
        res.status(404).json({ success: false, message: 'Kendaraan tidak ditemukan.' });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Data kendaraan berhasil diperbarui.',
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const success = await KendaraanRepository.delete(id);
      if (!success) {
        res.status(404).json({ success: false, message: 'Kendaraan tidak ditemukan.' });
        return;
      }

      res.status(200).json({ success: true, message: 'Kendaraan berhasil dinonaktifkan.' });
    } catch (err) {
      next(err);
    }
  }
}
