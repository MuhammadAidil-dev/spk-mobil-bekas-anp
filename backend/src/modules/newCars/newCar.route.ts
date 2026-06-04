import { asyncHandler } from '@/middleware/asyncHandler';
import { Router } from 'express';
import { validate } from '@/middleware/validatePayload';
import { newCarController } from './newCar.controller';
// import { upload } from '@/common/lib/multer';

const newCarRouter = Router();
/**
 * @route /api/v1/new-cars
 * 

/**
 * @access public
 * 
 */
newCarRouter.get(
  '/calculate-new-cars',
  asyncHandler(newCarController.calculateANP),
);
// newCarRouter.get(
//   '/:id',
//   validateParams(ValidIdCarSchema),
//   asyncHandler(carController.getCarByIdController),
// );

// /**
//  * @access private only admin
//  *
//  */
// newCarRouter.post(
//   '/',
//   authenticate,
//   upload.single('imageCar'),
//   validate(CreateCarSchema),
//   asyncHandler(carController.createCarController),
// );

// newCarRouter.delete(
//   '/:id',
//   authenticate,
//   validateParams(ValidIdCarSchema),
//   asyncHandler(carController.deleteCarController),
// );

export default newCarRouter;
