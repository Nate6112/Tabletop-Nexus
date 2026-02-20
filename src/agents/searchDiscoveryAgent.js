export class SearchDiscoveryAgent {
  constructor({ lobbyDirectory }) {
    this.lobbyDirectory = lobbyDirectory;
  }

  search({ query, rulesetId }) {
    return this.lobbyDirectory.list({ search: query, rulesetId });
  }
}
