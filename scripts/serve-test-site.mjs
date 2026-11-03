import { cp, mkdtemp, readFile, writeFile, stat, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, join, extname, sep } from 'node:path';
import { spawnSync } from 'node:child_process';
import { createServer } from 'node:http';

const root = resolve('.');
const temporary = await mkdtemp(join(tmpdir(), 'breuer-site-tests-'));
const source = join(temporary, 'source');
const output = join(temporary, 'site');
const origin = 'http://127.0.0.1:4312';
const { devDependencies } = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
const mathAssets = ['mathjax', '@mathjax/mathjax-newcm-font'].map(name => ({
  prefix: `/test-assets/npm/${name}@${devDependencies[name]}/`,
  directory: resolve(root, 'node_modules', name)
}));
const excluded = new Set(['.git', 'node_modules', '_site', '.jekyll-cache', '.jekyll-metadata', '.lighthouseci', '.lighthouse-site', 'test-results', 'playwright-report', 'lighthouse-reports']);
await cp(root, source, { recursive: true, filter: path => !excluded.has(path.slice(root.length + 1).split(sep)[0]) });
const now = Temporal.Now.instant();
for (const name of ['article', 'math']) {
  const fixture = (await readFile(join(root, `tests/fixtures/${name}.md`), 'utf8'))
    .replace('TEST_PUBLISHED_AT', now.subtract({ hours: 24 }).toString({ fractionalSecondDigits: 3 }))
    .replace('TEST_MODIFIED_AT', now.toString({ fractionalSecondDigits: 3 }));
  await writeFile(join(source, `_posts/2000-01-01-${name}.md`), fixture);
}
// Keep production versions and paths; mirror locked CDN bytes without browser routing.
const config = await readFile(join(source, '_config.yml'), 'utf8');
await writeFile(join(source, '_config.yml'), config.replaceAll('https://cdn.jsdelivr.net/npm/', `${origin}/test-assets/npm/`));
const build = spawnSync('bundle', ['exec', 'jekyll', 'build', '--trace', '--source', source, '--destination', output], {
  cwd: root, env: { ...process.env, JEKYLL_ENV: 'production', BUNDLE_GEMFILE: join(root, 'Gemfile') }, stdio: 'inherit'
});
if (build.error) throw build.error;
if (build.signal) throw new Error(`Jekyll terminated: ${build.signal}`);
if (build.status !== 0) process.exit(build.status);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'application/javascript', '.json': 'application/json', '.xml': 'application/xml', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.woff': 'font/woff', '.woff2': 'font/woff2' };
createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
    const mathAsset = mathAssets.find(asset => pathname.startsWith(asset.prefix));
    if (mathAsset) {
      const assetFile = resolve(mathAsset.directory, pathname.slice(mathAsset.prefix.length));
      if (!assetFile.startsWith(mathAsset.directory + sep)) { response.writeHead(403).end(); return; }
      const asset = await readFile(assetFile);
      response.writeHead(200, { 'Content-Type': types[extname(assetFile)] }).end(asset);
      return;
    }
    let file = resolve(output, '.' + pathname);
    if (!file.startsWith(output + sep) && file !== output) { response.writeHead(403).end(); return; }
    if (pathname === '/feed.xml') {
      response.writeHead(200, { 'Content-Type': types['.xml'] }).end(await readFile(file));
      return;
    }
    if (file === output || pathname.endsWith('/')) file = join(file, 'index.html');
    else if (!extname(file)) file += '.html';
    const info = await stat(file);
    if (!info.isFile()) { response.writeHead(404).end(); return; }
    const headers = {};
    if (types[extname(file)]) headers['Content-Type'] = types[extname(file)];
    response.writeHead(200, headers);
    response.end(await readFile(file));
  } catch (error) {
    if (error.code === 'ENOENT') response.writeHead(404).end();
    else { console.error(error); response.writeHead(500).end(); }
  }
}).listen(4312, '127.0.0.1');
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, async () => { await rm(temporary, { recursive: true, force: true }); process.exit(0); });
