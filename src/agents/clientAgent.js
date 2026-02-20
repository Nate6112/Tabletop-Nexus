export class ClientAgent {
  constructor({ sessionManager }) {
    this.sessionManager = sessionManager;
  }

  join({ joinCode, playerName, avatar }) {
    return this.sessionManager.joinSession(joinCode, { playerName, avatar });
  }
}
