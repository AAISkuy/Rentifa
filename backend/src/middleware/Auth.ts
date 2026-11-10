import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: 'customer' | 'admin';
  };
}

const JWT_SECRET = process.env.JWT_SECRET || 'rentifa_super_secret_jwt_key_2026';

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Akses ditolak. Token tidak disediakan.' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      email: string;
      role: 'customer' | 'admin';
    };
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Token tidak valid atau kedaluwarsa.' });
    return;
  }
};

export const adminMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ success: false, message: 'Akses terlarang. Diperlukan hak akses Admin.' });
    return;
  }
  next();
};
