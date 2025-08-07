import dotenv from 'dotenv';
dotenv.config();

function getEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

export const config = {
  PORT: getEnv('PORT'),
  CLIENT_URL: getEnv('CLIENT_URL'),
  JWT_SECRET: getEnv('JWT_SECRET'),
  NODE_ENV: getEnv('NODE_ENV'),
};
