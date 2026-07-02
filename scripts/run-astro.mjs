import { spawnSync } from 'node:child_process';

const args = process.argv.slice(2);
const existingNodeOptions = process.env.NODE_OPTIONS ?? '';
const dep0205Filter = '--disable-warning=DEP0205';
const nodeOptions = existingNodeOptions.includes(dep0205Filter)
  ? existingNodeOptions
  : [existingNodeOptions, dep0205Filter].filter(Boolean).join(' ');

const result = spawnSync('pnpm', ['exec', 'astro', ...args], {
  cwd: process.cwd(),
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_OPTIONS: nodeOptions,
  },
});

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);
