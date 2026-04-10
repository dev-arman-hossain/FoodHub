import { Router } from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import { ReviewController } from './review.controller';

const router = Router({ mergeParams: true }); // mergeParams for /meals/:mealId/reviews

router.post('/:mealId', checkAuth('CUSTOMER'), ReviewController.addReview);
router.get('/:mealId', ReviewController.getMealReviews);

export const ReviewRoutes = router;
