import { execFileSync } from 'node:child_process';

function run(command, args, options = {}) {
  execFileSync(command, args, {
    stdio: 'inherit',
    ...options,
  });
}

console.log('Stopping Docker app services before development E2E...');
run('docker', ['compose', 'stop', 'swimtrack-backend', 'swimtrack-frontend']);

console.log('Running Playwright in development mode...');
run('npx', ['playwright', 'test'], {
  env: {
    ...process.env,
    PLAYWRIGHT_API_URL:
      process.env.PLAYWRIGHT_API_URL || 'http://localhost:3000',
    PLAYWRIGHT_BASE_URL:
      process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:5173',
  },
});
