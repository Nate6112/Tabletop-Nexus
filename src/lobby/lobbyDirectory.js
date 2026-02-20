export class LobbyDirectory {
  constructor() {
    this.rooms = new Map();
  }

  upsert(room) {
    this.rooms.set(room.joinCode, { ...room, updatedAt: Date.now() });
  }

  list({ search = '', rulesetId } = {}) {
    const q = search.trim().toLowerCase();
    return Array.from(this.rooms.values()).filter((room) => {
      const matchesSearch = q.length === 0
        || room.roomName.toLowerCase().includes(q)
        || room.rulesetId.toLowerCase().includes(q);
      const matchesRuleset = !rulesetId || room.rulesetId === rulesetId;
      return matchesSearch && matchesRuleset;
    });
  }
}
