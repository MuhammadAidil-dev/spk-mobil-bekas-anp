import { asyncHandler } from '@/middleware/asyncHandler';
import { Router } from 'express';
import { validate } from '@/middleware/validatePayload';
import { validateParams } from '@/middleware/validateParams';
import { authenticate } from '@/middleware/authenticate';
import { upload } from '@/common/lib/multer';
import { newCarController } from './newCar.controller';
import { createNewCarSchema, updateNewCarSchema, ValidIdNewCarSchema } from './newCar.validation';

const newCarRouter = Router();

/**
 * @route /api/v1/new-cars
 * @access public
 */
newCarRouter.get('/', asyncHandler(newCarController.findAll));
newCarRouter.get('/calculate-new-cars', asyncHandler(newCarController.calculateANP));
newCarRouter.get(
  '/:id',
  validateParams(ValidIdNewCarSchema),
  asyncHandler(newCarController.findById),
);

/**
 * @access private — admin only
 */
newCarRouter.post(
  '/',
  authenticate,
  upload.single('imageCar'),
  validate(createNewCarSchema),
  asyncHandler(newCarController.create),
);

newCarRouter.patch(
  '/:id',
  authenticate,
  validateParams(ValidIdNewCarSchema),
  upload.single('imageCar'),
  validate(updateNewCarSchema),
  asyncHandler(newCarController.update),
);

newCarRouter.delete(
  '/:id',
  authenticate,
  validateParams(ValidIdNewCarSchema),
  asyncHandler(newCarController.remove),
);

export default newCarRouter;
