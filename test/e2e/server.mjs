import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const PORT = Number(process.env.E2E_PORT) || 8888;

const mounts = [
  { prefix: '/js/', root: resolve(__dirname, '../../build/bundle') },
  { prefix: '/', root: resolve(__dirname, 'fixtures') },
];

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
};

const server = http.createServer(async (req, res) => {
  try {
    const urlPath = decodeURIComponent(new URL(req.url, `http://${req.headers.host}`).pathname);
    const mount = mounts.find((m) => urlPath.startsWith(m.prefix));
    if (!mount) {
      res.writeHead(404).end('Not found');
      return;
    }
    const rel = normalize(urlPath.slice(mount.prefix.length)).replace(/^(\.\.[\\/])+/, '');
    const filePath = join(mount.root, rel);
    if (!filePath.startsWith(mount.root)) {
      res.writeHead(403).end('Forbidden');
      return;
    }
    const body = await readFile(filePath);
    res.writeHead(200, { 'Content-Type': mime[extname(filePath)] || 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404).end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`e2e static server listening on http://localhost:${PORT}`);
});
