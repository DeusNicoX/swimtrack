import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: process.env.PORT || 3000,
  databaseUrl: process.env.DATABASE_URL,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  jwtSecret: process.env.JWT_SECRET || 'swimtrack-dev-secret',
  pgDatabase: process.env.PGDATABASE,
  pgHost: process.env.PGHOST,
  pgPassword: process.env.PGPASSWORD,
  pgPort: process.env.PGPORT ? Number(process.env.PGPORT) : undefined,
  pgUser: process.env.PGUSER,
};
