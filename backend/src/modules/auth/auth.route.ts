import { validate } from '@/middleware/validatePayload';
import { Router } from 'express';
import { LoginSchema } from './auth.validation';
import { asyncHandler } from '@/middleware/asyncHandler';
import { authController } from './auth.controller';

const auhtRouter = Router();

auhtRouter.post(
  '/login',
  validate(LoginSchema),
  asyncHandler(authController.loginController),
);

export default auhtRouter;
