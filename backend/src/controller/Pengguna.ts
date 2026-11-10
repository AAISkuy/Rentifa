import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PenggunaRepository } from '../repository/Pengguna';
import { AuthenticatedRequest } from '../middleware/Auth';

const JWT_SECRET = process.env.JWT_SECRET || 'rentifa_super_secret_jwt_key_2026';

export class PenggunaController {
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, full_name, phone_number } = req.body;

      if (!email || !password || !full_name || !phone_number) {
        res.status(400).json({
          success: false,
          message: 'Semua field (email, password, nama lengkap, nomor telepon) wajib diisi.',
        });
        return;
      }

      if (password.length < 6) {
        res.status(400).json({
          success: false,
          message: 'Kata sandi minimal 6 karakter.',
        });
        return;
      }

      const existing = await PenggunaRepository.findByEmail(email);
      if (existing) {
        res.status(409).json({
          success: false,
          message: 'Email sudah terdaftar. Silakan login atau gunakan email lain.',
        });
        return;
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const user = await PenggunaRepository.createWithProfile({
        email,
        passwordHash,
        fullName: full_name,
        phoneNumber: phone_number,
        role: 'customer',
      });

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        success: true,
        message: 'Registrasi berhasil!',
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            full_name: user.full_name,
            phone_number: user.phone_number,
          },
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({
          success: false,
          message: 'Email dan kata sandi wajib diisi.',
        });
        return;
      }

      const user = await PenggunaRepository.findByEmail(email);
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Email atau kata sandi tidak sesuai.',
        });
        return;
      }

      if (!user.is_active) {
        res.status(403).json({
          success: false,
          message: 'Akun Anda dinonaktifkan. Hubungi admin.',
        });
        return;
      }

      const match = await bcrypt.compare(password, user.password_hash || '');
      if (!match) {
        res.status(401).json({
          success: false,
          message: 'Email atau kata sandi tidak sesuai.',
        });
        return;
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(200).json({
        success: true,
        message: 'Login berhasil!',
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            full_name: user.full_name,
            phone_number: user.phone_number,
          },
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const user = await PenggunaRepository.findById(userId);
      if (!user) {
        res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          role: user.role,
          full_name: user.full_name,
          phone_number: user.phone_number,
          address: user.address,
          city: user.city,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { full_name, phone_number, address, city } = req.body;

      const updated = await PenggunaRepository.updateProfile(userId, {
        full_name,
        phone_number,
        address,
        city,
      });

      res.status(200).json({
        success: true,
        message: 'Profil berhasil diperbarui.',
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getAllUsers(_req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await PenggunaRepository.getAll();
      res.status(200).json({
        success: true,
        data: users,
      });
    } catch (err) {
      next(err);
    }
  }
}
