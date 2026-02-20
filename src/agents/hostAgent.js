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
  }
}
