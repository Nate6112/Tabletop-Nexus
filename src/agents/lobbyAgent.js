export class LobbyAgent {
  constructor({ discovery, lobbyDirectory }) {
    this.discovery = discovery;
    this.lobbyDirectory = lobbyDirectory;
  }

  startDiscoveryListener() {
    this.discovery.startListening((room) => this.lobbyDirectory.upsert(room));
  }

  listRooms(filters) {
    return this.lobbyDirectory.list(filters);
  }
}
