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

const jwtSecret = process.env.JWT_SECRET || (nodeEnv === 'development' ? 'gearup_dev_jwt_secret_key_2026' : '');
if (nodeEnv === 'production' && jwtSecret.length < 32) {
  throw new Error('JWT_SECRET must be set to at least 32 characters in production');
}

const jwtExpiresInSeconds = Number(process.env.JWT_EXPIRES_IN_SECONDS || 60 * 60 * 24 * 7);
if (!Number.isSafeInteger(jwtExpiresInSeconds) || jwtExpiresInSeconds < 1) {
  throw new Error('JWT_EXPIRES_IN_SECONDS must be a positive integer');
}

const corsOrigins = (process.env.CORS_ORIGIN || (nodeEnv === 'development' ? 'http://localhost:3000' : ''))
  .split(',')
  .map((origin) => origin.trim().replace(/\/$/, ''))
  .filter(Boolean);

if (nodeEnv === 'production' && corsOrigins.length === 0) {
  throw new Error('CORS_ORIGIN must include the deployed frontend origin in production');
}

const schedulerEnabled = process.env.ENABLE_SCHEDULER === 'true';

export const env = {
  port,
  nodeEnv,
  mongoUri,
  jwtSecret,
  jwtExpiresInSeconds,
  corsOrigins,
  schedulerEnabled,
};
