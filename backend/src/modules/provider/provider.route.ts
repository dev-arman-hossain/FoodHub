import express from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import { ProviderController } from './provider.controller';
import { upload } from '../../middlewares/fileUpload';

const router = express.Router();

router.get(
    '/dashboard-stats',
    checkAuth('PROVIDER'),
    ProviderController.getDashboardStats
);

router.patch(
    '/profile',
    checkAuth('PROVIDER'),
    upload.single('logo'),
    ProviderController.updateProfile
);

export const ProviderRoutes = router;
