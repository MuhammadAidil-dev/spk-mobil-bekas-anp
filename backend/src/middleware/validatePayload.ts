import { ERROR_CODE, HTTP_CODE } from '@/common/error/http';
import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';

export const validate = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // Validasi semua payload, jangan berhenti di field error pertama,
      stripUnknown: true, // buang field yang tidak ada di schema
    });

    // Ubah array detail error menjadi object { field: message }
    // Contoh: { email: "Email wajib diisi", password: "Password wajib diisi" }
    if (error) {
      const errors = error.details.reduce<Record<string, string>>(
        (acc, detail) => {
          const field = detail.path.join('.');

          if (!acc[field]) {
            acc[field] = detail.message;
          }

          return acc;
        },
        {},
      );

      res.status(HTTP_CODE.BAD_REQUEST).json({
        success: false,
        message: 'Validasi gagal',
        code: ERROR_CODE.BAD_REQUEST,
        errors,
      });
      return;
    }

    res.locals.body = value;
    next();
  };
};
