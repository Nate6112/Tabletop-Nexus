# Tabletop Nexus (APK-First, Offline LAN)

Tabletop Nexus is a LAN-first, offline-capable multi-TCG simulator foundation targeting a **single Android APK** runtime with local profile, deck, lobby, and gameplay orchestration.

## Launch TCG support

- Magic: The Gathering
- Yu-Gi-Oh!
- Pokémon TCG

## Implemented architecture modules

### Core / Rules / Session

- `src/core/sessionManager.js`: session lifecycle, join codes, player joins, logs, snapshots.
- `src/core/gameModes.js`: Big Screen, Shared Tablet, Individual Field display modes.
- `src/rules/rulesetRegistry.js`: modular MTG/YGO/Pokémon ruleset definitions.

### APK-first local data and deck management

- `src/profile/localProfileStore.js`: local profile (username/avatar/stats/decks) persisted in app-local JSON.
- `src/deck/deckService.js`: deck import (`.txt`, `.ydk`, `.pkd`) + per-ruleset validation.
- `src/decks/deckParsers.js`: parser layer for MTG, YGO, and Pokémon deck formats.

### LAN lobby discovery and search

- `src/network/lanDiscovery.js`: UDP broadcast announce/listen primitives for room discovery.
- `src/lobby/lobbyDirectory.js`: searchable/filterable in-memory lobby registry.

### Offline asset management

- `src/offline/offlineAssetAgent.js`: local cache scaffolding for card data/images by ruleset.

### Agent modules (responsibility split)

- `src/agents/hostAgent.js`: room host creation + LAN broadcast.
- `src/agents/clientAgent.js`: join actions and private player participation.
- `src/agents/deckManagementAgent.js`: deck import and local persistence entrypoint.
- `src/agents/lobbyAgent.js`: discovery listener and room indexing.
- `src/agents/searchDiscoveryAgent.js`: lobby search/filter layer.
- `src/agents/replayUndoAgent.js`: action log, undo, replay export model.

### Workflow modules

- `src/workflows/firstLaunchWorkflow.js`: first-launch local account/profile setup.
- `src/workflows/hostLobbyWorkflow.js`: host room creation flow.
- `src/workflows/joinLobbyWorkflow.js`: join room flow.

### Orchestration + LAN API

- `src/core/appOrchestrator.js`: wires agents/services into one local runtime graph.
- `src/server/index.js`: offline LAN host routes:
  - `POST /profile/setup`
  - `POST /deck/import`
  - `POST /session/create`
  - `POST /session/join`
  - `POST /session/save`
  - `GET /session/state?joinCode=...`
  - `GET /lobby/rooms?search=&rulesetId=`

## Android APK wrapper

Native Android shell exists in `android/` and loads the LAN host via WebView.

Build debug APK:

```bash
cd android
JAVA_HOME=<path-to-jdk17> gradle :app:assembleDebug
```

Output APK:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

## Quick start (host)

```bash
npm install
npm start
```

Host binds to `0.0.0.0:8787` for LAN access.

## Vision alignment checklist

- ✅ Single-APK local runtime path (Android wrapper + local JSON persistence model)
- ✅ Local profile/account foundation
- ✅ Deck import/validation foundation for MTG/YGO/Pokémon
- ✅ Host/join/searchable lobby primitives over LAN discovery and local APIs
- ✅ Agent-based modular architecture for host/client/deck/lobby/search/offline/replay
- ✅ Save/resume foundation via snapshots and action log model
- ✅ Extensible ruleset registry for future TCG expansion

## Next implementation milestones

1. React/Flutter renderer with drag/drop and battlefield animations.
2. Deterministic action engine (stack/chain/combat) per ruleset.
3. Private/public state projection with authoritative host sync.
4. Local dataset sync/import tools for Scryfall/YGO/Pokémon card assets.
5. Replay export format + tournament/spectator toolchain.
