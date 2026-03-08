import { Router } from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import { ReviewController } from './review.controller';

const router = Router({ mergeParams: true }); // mergeParams for /meals/:mealId/reviews

router.post('/', checkAuth('CUSTOMER'), ReviewController.addReview);
router.get('/', ReviewController.getMealReviews);

export const ReviewRoutes = router;
