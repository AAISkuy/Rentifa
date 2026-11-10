import { Router } from 'express';
import { ReservasiController } from '../controller/Reservasi';
import { authMiddleware, adminMiddleware } from '../middleware/Auth';

const router = Router();

router.post('/', authMiddleware, ReservasiController.create);
router.get('/tracking/:code', ReservasiController.getByCode);
router.get('/my-bookings', authMiddleware, ReservasiController.getMyBookings);
router.get('/admin/stats', authMiddleware, adminMiddleware, ReservasiController.getStats);
router.get('/admin/all', authMiddleware, adminMiddleware, ReservasiController.getAll);
router.patch('/admin/:id/status', authMiddleware, adminMiddleware, ReservasiController.updateStatus);

export default router;
