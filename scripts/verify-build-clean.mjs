import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

const result = spawnSync('pnpm', ['run', 'build'], {
  cwd: process.cwd(),
  encoding: 'utf8',
  env: { ...process.env, CI: '1' },
});

const output = `${result.stdout ?? ''}${result.stderr ?? ''}`;
assert.equal(result.status, 0, output);
assert.ok(!output.includes('[DEP0205]'), 'build output should not include Node DEP0205 module.register deprecation warning');
assert.ok(!output.includes('module.register() is deprecated'), 'build output should not include module.register deprecation text');

console.log('Verified clean build output without DEP0205 warnings.');
