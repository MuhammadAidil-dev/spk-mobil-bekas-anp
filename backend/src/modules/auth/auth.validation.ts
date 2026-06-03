import Joi from 'joi';
import { LoginPayload } from './auth.type';

export const LoginSchema = Joi.object<LoginPayload>({
  email: Joi.string().email().required().messages({
    'string.empty': 'Email tidak boleh kosong',
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password minimal 8 karakter',
  }),
});
