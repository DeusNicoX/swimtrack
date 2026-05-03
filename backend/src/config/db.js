import pg from 'pg';
import { env } from './env.js';

const { Pool } = pg;

export const pool = new Pool(
  env.databaseUrl
    ? {
        connectionString: env.databaseUrl,
      }
    : {
        database: env.pgDatabase,
        host: env.pgHost,
        password: env.pgPassword,
        port: env.pgPort,
        user: env.pgUser,
      },
);
