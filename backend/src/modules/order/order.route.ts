import { Router } from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import { OrderController } from './order.controller';

const router = Router();

// Customer routes
router.post('/', checkAuth('CUSTOMER'), OrderController.createOrder);
router.get('/', checkAuth('CUSTOMER'), OrderController.getMyOrders);
router.get('/:id', checkAuth('CUSTOMER'), OrderController.getOrderById);
router.patch('/:id/cancel', checkAuth('CUSTOMER'), OrderController.cancelOrder);

// Provider routes
router.get('/provider/orders', checkAuth('PROVIDER'), OrderController.getProviderOrders);
router.patch('/provider/orders/:id', checkAuth('PROVIDER'), OrderController.updateOrderStatus);

export const OrderRoutes = router;
