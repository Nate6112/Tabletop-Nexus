import test from 'node:test';
import assert from 'node:assert/strict';
import { SessionManager } from '../../src/core/sessionManager.js';
import { LobbyDirectory } from '../../src/lobby/lobbyDirectory.js';
import { HostAgent } from '../../src/agents/hostAgent.js';

const makeDiscoveryStub = () => ({
  packets: [],
  broadcast(payload) {
    this.packets.push(payload);
  }
});

test('host agent enforces room capacity and updates seat counts', () => {
  const sessionManager = new SessionManager();
  const lobbyDirectory = new LobbyDirectory();
  const discovery = makeDiscoveryStub();
  const host = new HostAgent({ sessionManager, discovery, lobbyDirectory });

  const { session } = host.createHostedRoom({
    hostName: 'nate6112',
    rulesetId: 'mtg',
    displayMode: 'big-screen',
    maxPlayers: 2
  });

  assert.equal(host.canJoin(session.joinCode), true);

  sessionManager.joinSession(session.joinCode, { playerName: 'Alice' });
  const updated = host.syncRoomSeatCount(session.joinCode);

  assert.equal(updated.seatsFilled, 2);
  assert.equal(host.canJoin(session.joinCode), false);
  assert.equal(discovery.packets.length >= 2, true);
});
