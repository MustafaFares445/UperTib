#!/usr/bin/env node
// Minimal, dependency-free static file server for `storybook-static`, used only by Playwright's
// `webServer` (see ../playwright.config.ts). Serving the built output — rather than the Vite dev
// server — makes e2e runs fast and deterministic: no on-demand compilation, no HMR websocket, no
// per-story cold-start latency under parallel workers.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../storybook-static', import.meta.url));
const port = Number(process.env.PORT ?? 6006);

const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
};

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? '/', `http://localhost:${port}`);
    let relativePath = decodeURIComponent(url.pathname);
    if (relativePath === '/') {
      relativePath = '/index.html';
    }
    const filePath = normalize(join(root, relativePath));
    if (!filePath.startsWith(root)) {
      res.writeHead(403).end('Forbidden');
      return;
    }
    const info = await stat(filePath).catch(() => null);
    const resolved = info?.isDirectory() ? join(filePath, 'index.html') : filePath;
    const body = await readFile(resolved);
    res.writeHead(200, { 'Content-Type': CONTENT_TYPES[extname(resolved)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404).end('Not found');
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`storybook-static served at http://127.0.0.1:${port}`);
});
