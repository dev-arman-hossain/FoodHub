import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { CategoryRoutes } from '../modules/category/category.route';
import { MealRoutes } from '../modules/meal/meal.route';
import { OrderRoutes } from '../modules/order/order.route';
import { ReviewRoutes } from '../modules/review/review.route';
import { AdminRoutes } from '../modules/admin/admin.route';
import { ProviderRoutes } from '../modules/provider/provider.route';

const router = Router();

router.use('/auth', AuthRoutes);
router.use('/categories', CategoryRoutes);
router.use('/meals', MealRoutes);
router.use('/orders', OrderRoutes);
router.use('/reviews', ReviewRoutes);
router.use('/admin', AdminRoutes);
router.use('/provider', ProviderRoutes);

export const IndexRoutes = router;
