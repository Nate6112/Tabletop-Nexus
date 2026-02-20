import { createServer } from 'node:http';
import { AppOrchestrator } from '../core/appOrchestrator.js';
import { firstLaunchWorkflow } from '../workflows/firstLaunchWorkflow.js';
import { hostLobbyWorkflow } from '../workflows/hostLobbyWorkflow.js';
import { joinLobbyWorkflow } from '../workflows/joinLobbyWorkflow.js';

const port = Number(process.env.PORT ?? 8787);
const app = new AppOrchestrator();
app.profileStore.init();
app.lobbyAgent.startDiscoveryListener();

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
        routes: [
          '/profile/setup',
          '/deck/import',
          '/session/create',
          '/session/join',
          '/session/save',
          '/session/state?joinCode=XXXX',
          '/lobby/rooms?search=&rulesetId='
        ]
      });
    }

    if (req.method === 'POST' && req.url === '/profile/setup') {
      const body = await readJsonBody(req);
      const profile = firstLaunchWorkflow({
        profileStore: app.profileStore,
        username: body.username,
        avatar: body.avatar
      });
      return send(res, 200, { profile });
    }

    if (req.method === 'POST' && req.url === '/deck/import') {
      const body = await readJsonBody(req);
      const deck = app.deckManagementAgent.importDeck(body);
      return send(res, 200, { deck });
    }

    if (req.method === 'POST' && req.url === '/session/create') {
      const body = await readJsonBody(req);
      const result = hostLobbyWorkflow({
        hostAgent: app.hostAgent,
        hostName: body.hostName,
        roomName: body.roomName,
        rulesetId: body.rulesetId,
        displayMode: body.displayMode,
        maxPlayers: body.maxPlayers
      });
      return send(res, 200, result);
    }

    if (req.method === 'POST' && req.url === '/session/join') {
      const body = await readJsonBody(req);
      const player = joinLobbyWorkflow({
        clientAgent: app.clientAgent,
        joinCode: body.joinCode,
        playerName: body.playerName,
        avatar: body.avatar
      });
      return send(res, 200, { player });
    }

    if (req.method === 'POST' && req.url === '/session/save') {
      const body = await readJsonBody(req);
      app.hostAgent.sessionManager.saveSnapshot(body.joinCode, body.state);
      return send(res, 200, { ok: true });
    }

    if (req.method === 'GET' && req.url.startsWith('/session/state')) {
      const url = new URL(req.url, 'http://localhost');
      const joinCode = url.searchParams.get('joinCode');
      const session = app.hostAgent.sessionManager.getSession(joinCode);
      if (!session) return send(res, 404, { error: 'Session not found' });
      return send(res, 200, { session });
    }

    if (req.method === 'GET' && req.url.startsWith('/lobby/rooms')) {
      const url = new URL(req.url, 'http://localhost');
      const search = url.searchParams.get('search') ?? '';
      const rulesetId = url.searchParams.get('rulesetId') ?? undefined;
      const rooms = app.searchDiscoveryAgent.search({ query: search, rulesetId });
      return send(res, 200, { rooms });
    }

    return send(res, 404, { error: 'Not found' });
  } catch (error) {
    return send(res, 400, { error: error.message });
  }
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Tabletop Nexus host available on http://0.0.0.0:${port}`);
});
