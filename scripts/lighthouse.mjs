import { spawnSync } from 'node:child_process';
import { cp, mkdir, rm } from 'node:fs/promises';

await rm('lighthouse-reports', { recursive: true, force: true });
let failed = false;

for (const profile of ['mobile', 'desktop']) {
  await rm('.lighthouseci', { recursive: true, force: true });
  await mkdir('.lighthouseci');
  console.log(`\nLighthouse: ${profile}`);
  const env = { ...process.env, LIGHTHOUSE_PROFILE: profile };
  const run = command => {
    const result = spawnSync(process.execPath, ['node_modules/@lhci/cli/src/cli.js', command], {
      env, stdio: 'inherit'
    });
    if (result.error) throw result.error;
    if (result.signal) throw new Error(`Lighthouse ${command} terminated: ${result.signal}`);
    if (result.status !== 0) failed = true;
    return result.status === 0;
  };

  if (!run('collect')) {
    await cp('.lighthouseci', `lighthouse-reports/${profile}/incomplete`, { recursive: true });
    continue;
  }
  run('assert');
  run('upload');
  const output = `lighthouse-reports/${profile}`;
  await mkdir(output, { recursive: true });
  await cp('.lighthouseci/assertion-results.json', `${output}/assertion-results.json`);
}

console.log('\nLighthouse HTML/JSON reports: lighthouse-reports/{mobile,desktop}/');
process.exitCode = failed ? 1 : 0;
