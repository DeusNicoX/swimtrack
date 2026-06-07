import { execFileSync } from 'node:child_process';

const backendUrl = 'http://localhost:3000/';
const frontendUrl = 'http://localhost:8080/';
const timeoutMs = 60_000;
const intervalMs = 1_000;

function run(command, args, options = {}) {
  execFileSync(command, args, {
    stdio: 'inherit',
    ...options,
  });
}

async function waitForUrl(url) {
  const startedAt = Date.now();
  let lastError;

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url);

      if (response.ok) {
        console.log(`${url} is ready`);
        return;
      }

      lastError = new Error(`${url} returned HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }

    await new Promise((resolve) => {
      setTimeout(resolve, intervalMs);
    });
  }

  throw new Error(
    `Timed out waiting for ${url}: ${lastError?.message || 'unknown error'}`,
  );
}

console.log('Building and starting SwimTrack Docker stack...');
run('docker', ['compose', 'up', '-d', '--build']);

console.log('Waiting for backend and frontend...');
await waitForUrl(backendUrl);
await waitForUrl(frontendUrl);

console.log('Applying database schema inside swimtrack-backend...');
run('docker', [
  'compose',
  'exec',
  '-T',
  'swimtrack-backend',
  'npm',
  'run',
  'db:schema',
  '--workspace',
  'backend',
]);

console.log('Running Playwright against Docker services...');
run('npx', ['playwright', 'test'], {
  env: {
    ...process.env,
    PLAYWRIGHT_API_URL: 'http://localhost:3000',
    PLAYWRIGHT_BASE_URL: 'http://localhost:8080',
    PLAYWRIGHT_SCHEMA_APPLIED: '1',
    PLAYWRIGHT_SKIP_WEB_SERVER: '1',
  },
});
