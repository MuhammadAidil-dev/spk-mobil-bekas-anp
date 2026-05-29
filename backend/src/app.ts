import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { errorMiddleware } from './middleware/errorMiddleware';
import { loadEnv } from './config/env';
import { AppError } from './common/error/appError';
import { ERROR_CODE, HTTP_CODE } from './common/error/http';
import auhtRouter from './modules/auth/auth.route';
import anpRouter from './modules/anp/anp.route';

const env = loadEnv();

const app: Application = express();

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);

// middleware upload file
// app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// route
app.use('/api/v1/auth', auhtRouter);
app.use('/api/v1/anp', anpRouter);

// not found error
app.use((_req, _res, next) => {
  next(
    new AppError(
      'Route not found',
      HTTP_CODE.NOT_FOUND,
      ERROR_CODE.INTERNAL_SERVER,
    ),
  );
});

// global error middleware
app.use(errorMiddleware);
export default app;
