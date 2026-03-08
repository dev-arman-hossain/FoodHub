import { Router } from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { AuthController } from './auth.controller';
import { loginZodSchema, registerZodSchema } from './auth.validation';

const router = Router();

router.post('/register', validateRequest(registerZodSchema), AuthController.register);
router.post('/login', validateRequest(loginZodSchema), AuthController.login);
router.get('/me', checkAuth(), AuthController.getMe);
router.post('/logout', checkAuth(), AuthController.logout);
router.post('/refresh-token', AuthController.refreshToken);

export const AuthRoutes = router;
