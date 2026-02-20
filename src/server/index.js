import { createServer } from 'node:http';
import { SessionManager } from '../core/sessionManager.js';

const port = Number(process.env.PORT ?? 8787);
const sessionManager = new SessionManager();

const readJsonBody = async (req) => {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const text = Buffer.concat(chunks).toString('utf8');
  return text ? JSON.parse(text) : {};
};

const send = (res, status, payload) => {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
};

const server = createServer(async (req, res) => {
  try {
    if (req.method === 'GET' && req.url === '/') {
      return send(res, 200, {
        app: 'Tabletop Nexus',
        mode: 'LAN offline-first host',
        routes: ['/session/create', '/session/join', '/session/save', '/session/state?joinCode=XXXX']
      });
    }

    if (req.method === 'POST' && req.url === '/session/create') {
      const body = await readJsonBody(req);
      const session = sessionManager.createSession(body);
      return send(res, 200, { session });
    }

    if (req.method === 'POST' && req.url === '/session/join') {
      const body = await readJsonBody(req);
      const player = sessionManager.joinSession(body.joinCode, body);
      return send(res, 200, { player });
    }

    if (req.method === 'POST' && req.url === '/session/save') {
      const body = await readJsonBody(req);
      sessionManager.saveSnapshot(body.joinCode, body.state);
      return send(res, 200, { ok: true });
    }

    if (req.method === 'GET' && req.url.startsWith('/session/state')) {
      const url = new URL(req.url, 'http://localhost');
      const joinCode = url.searchParams.get('joinCode');
      const session = sessionManager.getSession(joinCode);
      if (!session) return send(res, 404, { error: 'Session not found' });
      return send(res, 200, { session });
    }

    return send(res, 404, { error: 'Not found' });
  } catch (error) {
    return send(res, 400, { error: error.message });
  }
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Tabletop Nexus host available on http://0.0.0.0:${port}`);
});
