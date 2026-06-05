import { asyncHandler } from '@/middleware/asyncHandler';
import { Router } from 'express';
import { carController } from './car.controller';
import { validateParams } from '@/middleware/validateParams';
import { CreateCarSchema, UpdateCarSchema, ValidIdCarSchema } from './car.validation';
import { authenticate } from '@/middleware/authenticate';
import { validate } from '@/middleware/validatePayload';
import { upload } from '@/common/lib/multer';

const carRouter = Router();
/**
 * @route /api/v1/cars
 * 

/**
 * @access public
 * 
 */
carRouter.get('/', asyncHandler(carController.getCarController));
carRouter.get(
  '/:id',
  validateParams(ValidIdCarSchema),
  asyncHandler(carController.getCarByIdController),
);

/**
 * @access private only admin
 *
 */
carRouter.post(
  '/',
  authenticate,
  upload.single('imageCar'),
  validate(CreateCarSchema),
  asyncHandler(carController.createCarController),
);

carRouter.patch(
  '/:id',
  authenticate,
  validateParams(ValidIdCarSchema),
  upload.single('imageCar'),
  validate(UpdateCarSchema),
  asyncHandler(carController.updateCarController),
);

carRouter.delete(
  '/:id',
  authenticate,
  validateParams(ValidIdCarSchema),
  asyncHandler(carController.deleteCarController),
);

export default carRouter;
