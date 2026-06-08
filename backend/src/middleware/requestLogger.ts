import morgan from 'morgan';
import { morganStream } from '@/common/lib/logger';

const isDev = process.env.NODE_ENV === 'development';

// Development: colorized, readable format
// Production: Apache Combined Log format for structured parsing
const format = isDev
  ? ':method :url :status :res[content-length] - :response-time ms'
  : ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms';

const requestLogger = morgan(format, {
  stream: morganStream,
  // Skip static file requests in development to reduce noise
  skip: (req) => {
    if (isDev) return req.url?.startsWith('/uploads') ?? false;
    return false;
  },
});

export default requestLogger;
