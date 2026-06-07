import pg from 'pg';

export default async function globalTeardown() {
  const pool = new pg.Pool({
    connectionString:
      process.env.DATABASE_URL ||
      'postgres://swimtrack:swimtrack@localhost:5433/swimtrack',
  });

  try {
    await pool.query("DELETE FROM users WHERE email LIKE 'e2e-%@test.com'");
  } finally {
    await pool.end();
  }
}
