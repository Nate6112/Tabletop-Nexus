import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { LocalProfileStore } from '../../src/profile/localProfileStore.js';
import { DeckService } from '../../src/deck/deckService.js';
import { LobbyDirectory } from '../../src/lobby/lobbyDirectory.js';
import { encodeDiscovery, decodeDiscovery } from '../../src/network/lanDiscovery.js';

test('local profile can be initialized and persisted', () => {
  const baseDir = '.tmp-test-profile';
  fs.rmSync(baseDir, { recursive: true, force: true });

  const store = new LocalProfileStore({ baseDir });
  const profile = store.upsertIdentity({ username: 'nate6112', avatar: 'mage' });

  assert.equal(profile.username, 'nate6112');
  assert.equal(store.load().avatar, 'mage');

  fs.rmSync(baseDir, { recursive: true, force: true });
});

test('deck service imports and validates deck locally', () => {
  const baseDir = '.tmp-test-decks';
  fs.rmSync(baseDir, { recursive: true, force: true });

  const store = new LocalProfileStore({ baseDir });
  const deckService = new DeckService(store);
  const deck = deckService.importDeck({
    rulesetId: 'mtg',
    extension: 'txt',
    content: '4 Lightning Bolt',
    name: 'Burn'
  });

  assert.equal(deck.rulesetId, 'mtg');
  assert.equal(store.load().decks.length, 1);

  fs.rmSync(baseDir, { recursive: true, force: true });
});

test('lobby directory supports search and ruleset filter', () => {
  const directory = new LobbyDirectory();
  directory.upsert({ joinCode: 'ABC123', roomName: "Nate's Room", rulesetId: 'mtg' });
  directory.upsert({ joinCode: 'DEF456', roomName: 'YGO Showdown', rulesetId: 'ygo' });

  assert.equal(directory.list({ search: 'nate' }).length, 1);
  assert.equal(directory.list({ rulesetId: 'ygo' }).length, 1);
});

test('discovery payload roundtrip works', () => {
  const payload = { roomName: 'Local Room', joinCode: 'ABC123' };
  const encoded = encodeDiscovery(payload);
  const decoded = decodeDiscovery(encoded);

  assert.equal(decoded.roomName, payload.roomName);
  assert.equal(decodeDiscovery('noise-packet'), null);
});
