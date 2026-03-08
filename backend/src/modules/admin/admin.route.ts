import { Router } from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import { AdminController } from './admin.controller';

const router = Router();

router.get('/users', checkAuth('ADMIN'), AdminController.getAllUsers);
router.patch('/users/:id/status', checkAuth('ADMIN'), AdminController.toggleUserStatus);
router.get('/orders', checkAuth('ADMIN'), AdminController.getAllOrders);
router.get('/stats', checkAuth('ADMIN'), AdminController.getDashboardStats);

export const AdminRoutes = router;
