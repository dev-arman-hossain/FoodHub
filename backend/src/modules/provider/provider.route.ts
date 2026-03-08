import express from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import { ProviderController } from './provider.controller';

const router = express.Router();

router.get(
    '/dashboard-stats',
    checkAuth('PROVIDER'),
    ProviderController.getDashboardStats
);

router.patch(
    '/profile',
    checkAuth('PROVIDER'),
    ProviderController.updateProfile
);

export const ProviderRoutes = router;
