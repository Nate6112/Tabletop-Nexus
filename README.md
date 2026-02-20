# Tabletop Nexus

Tabletop Nexus is a LAN-first, offline-capable multi-TCG tabletop simulator foundation for:

- Magic: The Gathering
- Yu-Gi-Oh!
- Pokémon TCG

## Current scope (foundation)

This repository now includes:

- A **session host** over local WebSockets (`src/server/index.js`).
- A **multi-ruleset registry** for MTG, Yu-Gi-Oh!, and Pokémon (`src/rules/rulesetRegistry.js`).
- **Display mode modeling** for big-screen, shared-tablet, and individual-field rendering patterns (`src/core/gameModes.js`).
- **Deck parsers** for `.txt`, `.ydk`, and `.pkd` imports (`src/decks/deckParsers.js`).
- A **session manager** with log and save snapshot support (`src/core/sessionManager.js`).

## Why this architecture

The engine is intentionally modular so each TCG can share transport/UI infrastructure while keeping game logic separate by ruleset.

- Transport: WebSocket LAN host
- Core: sessions, players, logs, snapshots
- Rules: pluggable per game
- Client UI: can be built independently for phone controller and battlefield renderer

## Quick start

```bash
npm install
npm start
```

Host starts on `0.0.0.0:8787` and is reachable on LAN by local IP.

## Next milestones

1. Deterministic action pipeline with per-ruleset validators.
2. Private/public state projection for phone vs battlefield views.
3. Replay + undo command stream.
4. Initial React renderer and mobile controller PWA.
5. Local cache sync adapters for card databases and images.
