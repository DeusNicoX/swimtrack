import { execFileSync } from 'node:child_process';

export default async function globalSetup() {
  const databaseUrl =
    process.env.DATABASE_URL ||
    'postgres://swimtrack:swimtrack@localhost:5433/swimtrack';

  execFileSync('docker', ['compose', 'up', '-d', 'swimtrack-postgres'], {
    stdio: 'inherit',
  });

  if (process.env.PLAYWRIGHT_SCHEMA_APPLIED === '1') {
    return;
  }

  execFileSync('npm', ['run', 'db:schema', '--workspace', 'backend'], {
    env: {
      ...process.env,
      DATABASE_URL: databaseUrl,
    },
    stdio: 'inherit',
  });
}
