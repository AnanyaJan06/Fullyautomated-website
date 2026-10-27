import dotenv from 'dotenv';

dotenv.config();

const nodeEnv = process.env.NODE_ENV || 'development';
const port = Number(process.env.PORT || 5000);
const mongoUri = process.env.MONGODB_URI ||
  (nodeEnv === 'development' ? 'mongodb://127.0.0.1:27017/automated_website' : '');

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be an integer between 1 and 65535');
}

if (!mongoUri) {
  throw new Error('MONGODB_URI is required outside development');
}

export const env = {
  port,
  nodeEnv,
  mongoUri,
  jwtSecret: process.env.JWT_SECRET || 'gearup_dev_jwt_secret_key_2026',
  jwtExpiresInSeconds: Number(process.env.JWT_EXPIRES_IN_SECONDS || 60 * 60 * 24 * 7),
  corsOrigins: (process.env.CORS_ORIGIN || 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
};
