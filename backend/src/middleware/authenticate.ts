import { AppError } from '@/common/error/appError';
import { ERROR_CODE, HTTP_CODE } from '@/common/error/http';
import { loadEnv } from '@/config/env';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const env = loadEnv();

interface JwtPayload {
  sub: string;
  username: string;
  role: string;
  iat: number;
  exp: number;
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token =
      req.headers.authorization?.split(' ')[1] ?? req.cookies?.accessToken;

    if (!token) {
      throw new AppError(
        'Token tidak ditemukan, silahkan login terlebih dahulu',
        HTTP_CODE.UNAUTHORIZED,
        ERROR_CODE.UNAUTHORIZED,
      );
    }

    const decoded = jwt.verify(token, env.JWT.SECRET as string) as JwtPayload;

    (req as any).user = decoded;

    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(HTTP_CODE.UNAUTHORIZED).json({
        success: false,
        message: 'Sesi telah berakhir. Silakan login kembali',
      });
      return;
    }

    if (err instanceof jwt.JsonWebTokenError) {
      res.status(HTTP_CODE.UNAUTHORIZED).json({
        success: false,
        message: 'Token tidak valid',
      });
      return;
    }

    next(err);
  }
};
