import { createHash, randomBytes } from 'node:crypto';
import { existsSync, readFileSync, realpathSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:net';

// Never replace an existing environment, including one prepared by a developer.
if (existsSync('.env')) {
  console.log('Keeping existing .env.');
  process.exit(0);
}

// Stable per checkout, including worktrees with the same directory basename.
const hash = createHash('sha256').update(realpathSync('.')).digest('hex');
const offset = Number.parseInt(hash.slice(0, 8), 16) % 10000;

async function availablePort(start) {
  for (let port = start; port < start + 100; port++) {
    const server = createServer();
    const free = await new Promise((resolve, reject) => {
      server.once('error', (error) => error.code === 'EADDRINUSE' ? resolve(false) : reject(error));
      server.listen(port, '127.0.0.1', () => server.close(() => resolve(true)));
    });
    if (free) return port;
  }
  throw new Error(`No available local port near ${start}`);
}

const port = await availablePort(13000 + offset);
const dbPort = await availablePort(35000 + offset);
const minioPort = await availablePort(45000 + offset);
const minioConsolePort = await availablePort(55000 + offset);
const password = randomBytes(24).toString('hex');
const appUrl = `http://localhost:${port}`;
const s3Endpoint = `http://localhost:${minioPort}`;
const values = {
  PORT: port,
  COMPOSE_PROJECT_NAME: `trueque-o-trato-${hash.slice(0, 12)}`,
  POSTGRES_USER: 'trueque',
  POSTGRES_PASSWORD: password,
  POSTGRES_DB: 'trueque_o_trato',
  DATABASE_PORT: dbPort,
  DATABASE_URL: `"postgresql://trueque:${password}@127.0.0.1:${dbPort}/trueque_o_trato?schema=public"`,
  AUTH_SECRET: `"${randomBytes(32).toString('base64')}"`,
  NEXTAUTH_URL: `"${appUrl}"`,
  MINIO_PORT: minioPort,
  MINIO_CONSOLE_PORT: minioConsolePort,
  S3_ENDPOINT: `"${s3Endpoint}"`,
  S3_ACCESS_KEY: '"trueque"',
  S3_SECRET_KEY: `"${randomBytes(24).toString('hex')}"`,
  S3_PUBLIC_URL: `"${s3Endpoint}/trueque-images"`,
};
let template = readFileSync('.env.example', 'utf8');
for (const [key, value] of Object.entries(values)) {
  const pattern = new RegExp(`^${key}=.*$`, 'm');
  if (!pattern.test(template)) throw new Error(`Missing ${key} in .env.example`);
  template = template.replace(pattern, () => `${key}=${value}`);
}
writeFileSync('.env', template, { flag: 'wx', mode: 0o600 });
console.log(`Created .env for ${values.COMPOSE_PROJECT_NAME}.`);
console.log(`App: ${appUrl}; Postgres: 127.0.0.1:${dbPort}; MinIO: ${s3Endpoint} (console http://localhost:${minioConsolePort}).`);
console.log('Next: mise run services:up, mise run db:migrate, mise run dev.');
