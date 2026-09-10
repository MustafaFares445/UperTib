import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const playwrightCli = fileURLToPath(new URL('../node_modules/@playwright/test/cli.js', import.meta.url));

if (!existsSync(playwrightCli)) {
  console.error(`Playwright CLI was not found at ${playwrightCli}. Run npm ci before the approval audit.`);
  process.exit(1);
}

const child = spawn(
  process.execPath,
  [
    playwrightCli,
    'test',
    'playwright/authoritative-audit.spec.ts',
    '--project=patient-320',
    '--project=patient-390',
    '--project=patient-414',
    '--workers=3',
  ],
  {
    stdio: 'inherit',
    shell: false,
    env: { ...process.env, AUTHORITATIVE_AUDIT: '1' },
  },
);

child.once('error', (error) => {
  console.error(error);
  process.exitCode = 1;
});

child.once('exit', (code, signal) => {
  if (signal) {
    console.error(`Patient approval audit terminated by signal ${signal}.`);
    process.exitCode = 1;
    return;
  }
  process.exitCode = code ?? 1;
});
