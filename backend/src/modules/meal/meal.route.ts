import { Router } from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import { MealController } from './meal.controller';

const router = Router();

// Public routes
router.get('/', MealController.getAllMeals);
router.get('/providers', MealController.getAllProviders);
router.get('/providers/:id', MealController.getProviderById);
router.get('/:id', MealController.getMealById);

// Provider routes
router.post('/provider/meals', checkAuth('PROVIDER'), MealController.addMeal);
router.put('/provider/meals/:id', checkAuth('PROVIDER'), MealController.updateMeal);
router.delete('/provider/meals/:id', checkAuth('PROVIDER'), MealController.deleteMeal);

export const MealRoutes = router;
