import { NextFunction, Request, Response } from 'express';
import { loadEnv } from '../config/env';
import { AppError } from '@/common/error/appError';
import { ERROR_CODE, ERROR_MESSAGE, HTTP_CODE } from '@/common/error/http';
import logger from '@/common/lib/logger';

const env = loadEnv();

const hasNumericCode = (error: unknown): error is { code: number } => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as { code: unknown }).code === 'number'
  );
};

const hasStack = (error: unknown): error is { stack: string } => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'stack' in error &&
    typeof (error as { stack: unknown }).stack === 'string'
  );
};

export const errorMiddleware = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (res.headersSent) {
    return next(err);
  }

  let statusCode = HTTP_CODE.INTERNAL_SERVER;
  let message = ERROR_MESSAGE.SERVER.INTERNAL_SERVER;
  let code = ERROR_CODE.INTERNAL_SERVER;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    code = err.code;
  }

  if (hasNumericCode(err) && err.code === 11000) {
    statusCode = HTTP_CODE.CONFLICT;
    message = ERROR_MESSAGE.MONGO.DUPLICATE_KEY;
    code = ERROR_CODE.DUPLICATE_KEY;
  }

  const requestContext = {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    statusCode,
    code,
  };

  // 404s are expected (client navigated to wrong URL) — log only in debug
  if (statusCode === HTTP_CODE.NOT_FOUND) {
    logger.debug('Route not found', requestContext);
  } else if (statusCode >= 500) {
    logger.error(message, {
      ...requestContext,
      ...(hasStack(err) && { stack: (err as { stack: string }).stack }),
      error: err instanceof Error ? err.message : String(err),
    });
  } else {
    logger.warn(message, requestContext);
  }

  return res.status(statusCode).json({
    success: false,
    message,
    code,
    ...(env.NODE_ENV === 'development' &&
      hasStack(err) && { stack: err.stack }),
  });
};
