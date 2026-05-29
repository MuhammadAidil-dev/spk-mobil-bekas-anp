import { Router } from 'express';

import { anpController } from './anp.controller';
import { asyncHandler } from '@/middleware/asyncHandler';

const anpRouter = Router();

anpRouter.get('/calculate', asyncHandler(anpController.calculateRanking));

export default anpRouter;
