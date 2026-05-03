import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from '../config/db.js';

const currentDir = dirname(fileURLToPath(import.meta.url));
const schemaPath = resolve(currentDir, '../../db/schema.sql');

try {
  const schema = await readFile(schemaPath, 'utf8');

  await pool.query(schema);
  console.log('SwimTrack database schema applied successfully.');
} catch (error) {
  console.error('Failed to apply SwimTrack database schema.');
  console.error(error.message || error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
