export class HostAgent {
  constructor({ sessionManager, discovery, lobbyDirectory }) {
    this.sessionManager = sessionManager;
    this.discovery = discovery;
    this.lobbyDirectory = lobbyDirectory;
  }

  createHostedRoom({ hostName, roomName, rulesetId, displayMode, maxPlayers = 2 }) {
    const session = this.sessionManager.createSession({ hostName, rulesetId, displayMode });
    const room = {
      joinCode: session.joinCode,
      roomName: roomName || `${hostName}'s Room`,
      rulesetId,
      displayMode,
      seatsFilled: 1,
      maxPlayers
    };

    this.discovery.broadcast(room);
    if (this.lobbyDirectory) this.lobbyDirectory.upsert(room);
    return { session, room };
    this.publishRoom(room);
    return { session, room };
  }

  canJoin(joinCode) {
    const room = this.lobbyDirectory?.rooms.get(joinCode);
    if (!room) return true;
    return room.seatsFilled < room.maxPlayers;
  }

  syncRoomSeatCount(joinCode) {
    const session = this.sessionManager.requireSession(joinCode);
    const room = this.lobbyDirectory?.rooms.get(session.joinCode);
    if (!room) return null;

    const updatedRoom = {
      ...room,
      seatsFilled: session.players.length + 1
    };

    this.publishRoom(updatedRoom);
    return updatedRoom;
  }

  publishRoom(room) {
    this.discovery.broadcast(room);
    if (this.lobbyDirectory) this.lobbyDirectory.upsert(room);
  }
}
