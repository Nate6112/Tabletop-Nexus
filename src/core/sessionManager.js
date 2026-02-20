import crypto from 'node:crypto';
import { RulesetRegistry } from '../rules/rulesetRegistry.js';
import { DisplayMode, PublicViews } from './gameModes.js';

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;
const normalizeJoinCode = (value) => String(value ?? '').trim().toUpperCase();
const isJoinCode = (value) => /^[A-F0-9]{6}$/.test(normalizeJoinCode(value));

export class SessionManager {
  constructor() {
    this.sessions = new Map();
  }

  createSession({ hostName, displayMode = DisplayMode.BIG_SCREEN, rulesetId = 'mtg' }) {
    if (!isNonEmptyString(hostName)) {
      throw new Error('hostName is required');
    }

    if (!Object.values(DisplayMode).includes(displayMode)) {
      throw new Error(`Unsupported display mode: ${displayMode}`);
    }

    const sessionId = crypto.randomUUID().slice(0, 8);

    let joinCode = crypto.randomBytes(3).toString('hex').toUpperCase();
    while (this.sessions.has(joinCode)) {
      joinCode = crypto.randomBytes(3).toString('hex').toUpperCase();
    }

    const session = {
      sessionId,
      joinCode,
      createdAt: Date.now(),
      hostName: hostName.trim(),
      displayMode,
      publicView: PublicViews[displayMode],
      ruleset: RulesetRegistry.require(rulesetId),
      players: [],
      log: [],
      snapshots: []
    };

    this.sessions.set(joinCode, session);
    this.logEvent(joinCode, 'session-created', { hostName: session.hostName, displayMode, rulesetId });
    return session;
  }

  getSession(joinCode) {
    if (!isJoinCode(joinCode)) return undefined;
    return this.sessions.get(normalizeJoinCode(joinCode));
  }

  joinSession(joinCode, { playerName, avatar }) {
    if (!isJoinCode(joinCode)) {
      throw new Error('Invalid joinCode format');
    }

    if (!isNonEmptyString(playerName)) {
      throw new Error('playerName is required');
    }

    const session = this.requireSession(joinCode);
    const player = {
      id: crypto.randomUUID().slice(0, 8),
      playerName: playerName.trim(),
      avatar: avatar ?? 'default',
      connectedAt: Date.now(),
      privateZones: {}
    };
    session.players.push(player);
    this.logEvent(joinCode, 'player-joined', { playerName: player.playerName });
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
    if (!isJoinCode(joinCode)) throw new Error('Invalid joinCode format');
    const normalizedJoinCode = normalizeJoinCode(joinCode);
    const session = this.sessions.get(normalizedJoinCode);
    if (!session) throw new Error(`Session not found: ${normalizedJoinCode}`);
    return session;
  }
}
