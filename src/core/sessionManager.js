import crypto from 'node:crypto';
import { RulesetRegistry } from '../rules/rulesetRegistry.js';
import { DisplayMode, PublicViews } from './gameModes.js';

export class SessionManager {
  constructor() {
    this.sessions = new Map();
  }

  createSession({ hostName, displayMode = DisplayMode.BIG_SCREEN, rulesetId = 'mtg' }) {
    const sessionId = crypto.randomUUID().slice(0, 8);
    const joinCode = crypto.randomBytes(3).toString('hex').toUpperCase();

    const session = {
      sessionId,
      joinCode,
      createdAt: Date.now(),
      hostName,
      displayMode,
      publicView: PublicViews[displayMode],
      ruleset: RulesetRegistry.require(rulesetId),
      players: [],
      log: [],
      snapshots: []
    };

    this.sessions.set(joinCode, session);
    this.logEvent(joinCode, 'session-created', { hostName, displayMode, rulesetId });
    return session;
  }

  getSession(joinCode) {
    return this.sessions.get(joinCode);
  }

  joinSession(joinCode, { playerName, avatar }) {
    const session = this.requireSession(joinCode);
    const player = {
      id: crypto.randomUUID().slice(0, 8),
      playerName,
      avatar: avatar ?? 'default',
      connectedAt: Date.now(),
      privateZones: {}
    };
    session.players.push(player);
    this.logEvent(joinCode, 'player-joined', { playerName });
    return player;
  }

  saveSnapshot(joinCode, state) {
    const session = this.requireSession(joinCode);
    session.snapshots.push({ savedAt: Date.now(), state });
    this.logEvent(joinCode, 'snapshot-saved', { count: session.snapshots.length });
  }

  logEvent(joinCode, type, payload = {}) {
    const session = this.requireSession(joinCode);
    session.log.push({
      at: Date.now(),
      type,
      payload
    });
  }

  requireSession(joinCode) {
    const session = this.sessions.get(joinCode);
    if (!session) throw new Error(`Session not found: ${joinCode}`);
    return session;
  }
}
