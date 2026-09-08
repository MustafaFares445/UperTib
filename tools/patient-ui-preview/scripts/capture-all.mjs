import { spawn } from 'node:child_process';

const executable = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const specs = [
  'playwright/capture.spec.ts',
  'playwright/capture-slice3.spec.ts',
  'playwright/capture-slice4.spec.ts',
  'playwright/capture-slice5.spec.ts',
  'playwright/capture-slice6.spec.ts',
  'playwright/capture-slice7.spec.ts',
  'playwright/capture-slice8.spec.ts',
  'playwright/capture-slice9.spec.ts',
  'playwright/capture-slice10.spec.ts',
  'playwright/capture-slice11.spec.ts',
  'playwright/capture-slice12.spec.ts',
];

const child = spawn(
  executable,
  ['playwright', 'test', ...specs, '--project=patient-320', '--project=patient-390', '--project=patient-414'],
  {
    stdio: 'inherit',
    shell: false,
    env: { ...process.env, CAPTURE: '1' },
  },
);

child.on('error', (error) => {
  console.error(error);
  process.exitCode = 1;
});

child.on('exit', (code, signal) => {
  if (signal) {
    console.error(`Visual capture terminated by signal ${signal}.`);
    process.exitCode = 1;
    return;
  }
  process.exitCode = code ?? 1;
});
