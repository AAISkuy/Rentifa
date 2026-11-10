import { Router } from 'express';
import { KendaraanController } from '../controller/Kendaraan';
import { authMiddleware, adminMiddleware } from '../middleware/Auth';

const router = Router();

router.get('/categories', KendaraanController.getCategories);
router.get('/', KendaraanController.getCatalog);
router.get('/admin/all', authMiddleware, adminMiddleware, KendaraanController.getAllForAdmin);
router.get('/:id', KendaraanController.getDetail);
router.post('/', authMiddleware, adminMiddleware, KendaraanController.create);
router.put('/:id', authMiddleware, adminMiddleware, KendaraanController.update);
router.delete('/:id', authMiddleware, adminMiddleware, KendaraanController.delete);

export default router;
