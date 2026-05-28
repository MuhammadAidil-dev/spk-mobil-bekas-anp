import { RequestHandler, Request, Response, NextFunction } from 'express';

export const asyncHandler = (fn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
  };
};
