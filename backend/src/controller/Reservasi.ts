import { Response, NextFunction } from 'express';
import { ReservasiRepository } from '../repository/Reservasi';
import { AuthenticatedRequest } from '../middleware/Auth';

export class ReservasiController {
  static async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const customerId = req.user!.id;
      const { vehicle_id, start_date, end_date, customer_notes, payment_method } = req.body;

      if (!vehicle_id || !start_date || !end_date) {
        res.status(400).json({
          success: false,
          message: 'Kendaraan, tanggal mulai, dan tanggal selesai wajib diisi.',
        });
        return;
      }

      const booking = await ReservasiRepository.createBooking(customerId, {
        vehicle_id: Number(vehicle_id),
        start_date,
        end_date,
        customer_notes,
        payment_method,
      });

      res.status(201).json({
        success: true,
        message: 'Pengajuan booking berhasil dibuat!',
        data: booking,
      });
    } catch (err: any) {
      next(err);
    }
  }

  static async getByCode(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const code = String(req.params.code);
      const booking = await ReservasiRepository.getByCode(code);
      if (!booking) {
        res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
        return;
      }

      res.status(200).json({ success: true, data: booking });
    } catch (err) {
      next(err);
    }
  }

  static async getMyBookings(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const customerId = req.user!.id;
      const bookings = await ReservasiRepository.getByCustomerId(customerId);
      res.status(200).json({ success: true, data: bookings });
    } catch (err) {
      next(err);
    }
  }

  static async getAll(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status } = req.query;
      const bookings = await ReservasiRepository.getAll(status ? String(status) : undefined);
      res.status(200).json({ success: true, data: bookings });
    } catch (err) {
      next(err);
    }
  }

  static async updateStatus(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const bookingId = Number(req.params.id);
      const adminId = req.user!.id;
      const { status, notes } = req.body;

      if (!status) {
        res.status(400).json({ success: false, message: 'Status baru wajib ditentukan.' });
        return;
      }

      const updated = await ReservasiRepository.updateStatus(bookingId, status, adminId, notes);
      res.status(200).json({
        success: true,
        message: 'Status pesanan berhasil diperbarui.',
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getStats(_req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await ReservasiRepository.getStats();
      res.status(200).json({ success: true, data: stats });
    } catch (err) {
      next(err);
    }
  }
}
