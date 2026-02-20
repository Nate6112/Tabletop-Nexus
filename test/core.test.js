import test from 'node:test';
import assert from 'node:assert/strict';
import { SessionManager } from '../src/core/sessionManager.js';
import { parseDeckByExtension } from '../src/decks/deckParsers.js';
import { RulesetRegistry } from '../src/rules/rulesetRegistry.js';

test('session creation and join flow works', () => {
  const sm = new SessionManager();
  const session = sm.createSession({ hostName: 'Host', rulesetId: 'mtg' });

  assert.equal(session.hostName, 'Host');
  assert.equal(session.ruleset.id, 'mtg');

  const player = sm.joinSession(session.joinCode, { playerName: 'Alice' });
  assert.equal(player.playerName, 'Alice');
  assert.equal(sm.getSession(session.joinCode).players.length, 1);
});

test('session creation validates required fields', () => {
  const sm = new SessionManager();

  assert.throws(() => sm.createSession({ hostName: '' }), /hostName is required/);
  assert.throws(
    () => sm.createSession({ hostName: 'Host', displayMode: 'unsupported-mode' }),
    /Unsupported display mode/
  );
});

test('deck parsing routes by extension', () => {
  const ygoDeck = parseDeckByExtension('ydk', '#main\n12345\n#extra\n67890\n!side\n54321');
  assert.equal(ygoDeck.format, 'ydk');
  assert.equal(ygoDeck.cards.length, 3);
  assert.equal(ygoDeck.cards[0].section, 'main');
  assert.equal(ygoDeck.cards[1].section, 'extra');
  assert.equal(ygoDeck.cards[2].section, 'side');

  const mtgDeck = parseDeckByExtension('txt', '4 Lightning Bolt');
  assert.equal(mtgDeck.cards[0].name, 'Lightning Bolt');
});

test('registry provides three launch rulesets', () => {
  const ids = RulesetRegistry.list().map((r) => r.id).sort();
  assert.deepEqual(ids, ['mtg', 'pokemon', 'ygo']);
});
