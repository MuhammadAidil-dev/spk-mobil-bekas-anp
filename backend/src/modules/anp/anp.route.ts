import { Router } from 'express';
import { asyncHandler } from '@/middleware/asyncHandler';
import { anpController } from './anp.controller';

const anpRouter = Router();

anpRouter.get('/calculate', asyncHandler(anpController.calculateRanking));

export default anpRouter;
