import dotenv from 'dotenv';

dotenv.config();

/**
 * Normalized environment values used by the backend.
 *
 * Defaults are development-oriented; production deployments should provide
 * DATABASE_URL and JWT_SECRET explicitly.
 */
export const env = {
  port: process.env.PORT || 3000,
  corsOrigin: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
    : undefined,
  databaseUrl: process.env.DATABASE_URL,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  jwtSecret: process.env.JWT_SECRET || 'swimtrack-dev-secret',
  nodeEnv: process.env.NODE_ENV || 'development',
  pgDatabase: process.env.PGDATABASE,
  pgHost: process.env.PGHOST,
  pgPassword: process.env.PGPASSWORD,
  pgPort: process.env.PGPORT ? Number(process.env.PGPORT) : undefined,
  pgUser: process.env.PGUSER,
};
