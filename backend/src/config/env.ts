import dotenv from 'dotenv';

dotenv.config(); // load default .env

const nodeEnv = process.env.NODE_ENV || 'development';
dotenv.config({ path: `.env.${nodeEnv}`, override: false });

const getEnv = (key: string): string => {
  const value = process.env[key];
  if (value === undefined || value === '') {
    throw new Error(
      `Environment variable ${key} is required to run the server`,
    );
  }
  return value.trim();
};

export const loadEnv = () => {
  const port = Number(getEnv('PORT'));
  if (!Number.isInteger(port)) {
    throw new Error('PORT must be a valid integer');
  }

  return {
    NODE_ENV: nodeEnv,
    PORT: port,
    MONGO_URI: getEnv('MONGO_URI'),
    URL: getEnv('URL'),

    JWT: {
      SECRET: getEnv('JWT_SECRET_KEY'),
      REFRESH_SECRET: getEnv('JWT_REFRESH_TOKEN_KEY'),
      EXPIRES_IN: getEnv('JWT_EXPIRES_IN'),
    },
    ADMIN: {
      EMAIL: getEnv('ADMIN_EMAIL'),
      PASSWORD: getEnv('ADMIN_PASSWORD'),
    },

    CLIENT_URL: getEnv('CLIENT_URL'),
  };
};
