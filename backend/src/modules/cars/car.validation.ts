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

export const UpdateCarSchema = Joi.object({
  brand: Joi.string().trim(),
  model: Joi.string().trim(),
  year: Joi.number().integer().min(1990).max(new Date().getFullYear()),
  price: Joi.number().positive(),
  mileage: Joi.number().min(0),
  engine_capacity: Joi.number().positive(),
  seat_capacity: Joi.number().integer().min(1),
  transmission: Joi.string().valid('manual', 'automatic'),
  fuel_type: Joi.string().valid('gasoline', 'diesel', 'hybrid', 'electric'),
  color: Joi.string().trim(),
  plate_region: Joi.string().trim().allow(''),
  image_url: Joi.string().trim().allow('').optional(),
  description: Joi.string().trim().allow(''),
  is_active: Joi.boolean(),
})
  .min(1)
  .options({ abortEarly: false, allowUnknown: false });
