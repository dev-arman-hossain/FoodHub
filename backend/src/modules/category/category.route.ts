import { Router } from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import { CategoryController } from './category.controller';

const router = Router();

router.get('/', CategoryController.getAllCategories);
router.post('/', checkAuth('ADMIN'), CategoryController.createCategory);
router.put('/:id', checkAuth('ADMIN'), CategoryController.updateCategory);
router.delete('/:id', checkAuth('ADMIN'), CategoryController.deleteCategory);

export const CategoryRoutes = router;
