import Joi from 'joi';
import mongoose from 'mongoose';
import { CreateCarDTO } from './car.type';

export const ValidIdCarSchema = Joi.object({
  id: Joi.string().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return helpers.error('any.invalid');
    }

    return value;
  }),
});

export const CreateCarSchema = Joi.object<CreateCarDTO>({
  brand: Joi.string().trim().required(),

  model: Joi.string().trim().required(),

  year: Joi.number()
    .integer()
    .min(1990)
    .max(new Date().getFullYear())
    .required(),

  price: Joi.number().positive().required(),

  mileage: Joi.number().min(0).required(),

  engine_capacity: Joi.number().positive().required(),

  seat_capacity: Joi.number().integer().min(1).required(),

  transmission: Joi.string().valid('manual', 'automatic').required(),

  fuel_type: Joi.string()
    .valid('gasoline', 'diesel', 'hybrid', 'electric')
    .required(),

  color: Joi.string().trim().required(),

  plate_region: Joi.string().trim().required(),

  description: Joi.string().trim().allow('').default(''),
});
