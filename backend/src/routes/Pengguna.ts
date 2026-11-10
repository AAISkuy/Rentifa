import { Router } from 'express';
import { PenggunaController } from '../controller/Pengguna';
import { authMiddleware, adminMiddleware } from '../middleware/Auth';

const router = Router();

router.post('/register', PenggunaController.register);
router.post('/login', PenggunaController.login);
router.get('/profile', authMiddleware, PenggunaController.getProfile);
router.put('/profile', authMiddleware, PenggunaController.updateProfile);
router.get('/users', authMiddleware, adminMiddleware, PenggunaController.getAllUsers);

export default router;
