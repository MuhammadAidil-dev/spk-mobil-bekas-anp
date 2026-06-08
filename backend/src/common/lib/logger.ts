import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';

const isDev = process.env.NODE_ENV === 'development';
const LOG_DIR = path.join(process.cwd(), 'logs');

// ─── Formats ─────────────────────────────────────────────────────────────────

const devFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.colorize({ all: true }),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    const metaStr =
      Object.keys(meta).length > 0
        ? `\n  ${JSON.stringify(meta, null, 2).replace(/\n/g, '\n  ')}`
        : '';
    const stackStr = stack ? `\n${stack}` : '';
    return `[${timestamp}] ${level}: ${message}${metaStr}${stackStr}`;
  }),
);

const prodFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json(),
);

// ─── Transports ───────────────────────────────────────────────────────────────

const consoleTransport = new winston.transports.Console({
  silent: false,
});

const errorFileTransport = new DailyRotateFile({
  dirname: LOG_DIR,
  filename: 'error-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  level: 'error',
  maxSize: '20m',
  maxFiles: '14d',
  zippedArchive: true,
});

const combinedFileTransport = new DailyRotateFile({
  dirname: LOG_DIR,
  filename: 'combined-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '30d',
  zippedArchive: true,
});

const httpFileTransport = new DailyRotateFile({
  dirname: LOG_DIR,
  filename: 'http-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  level: 'http',
  maxSize: '20m',
  maxFiles: '14d',
  zippedArchive: true,
});

// ─── Logger ───────────────────────────────────────────────────────────────────

const logger = winston.createLogger({
  level: isDev ? 'debug' : 'info',
  defaultMeta: {
    service: 'spk-mobil-bekas',
    env: process.env.NODE_ENV ?? 'development',
  },
  format: isDev ? devFormat : prodFormat,
  transports: isDev
    ? [consoleTransport]
    : [
        consoleTransport,
        errorFileTransport,
        combinedFileTransport,
        httpFileTransport,
      ],
  exitOnError: false,
});

// ─── Utility: Morgan stream ───────────────────────────────────────────────────

export const morganStream = {
  write: (message: string) => logger.http(message.trimEnd()),
};

export default logger;
