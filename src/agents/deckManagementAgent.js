export class DeckManagementAgent {
  constructor({ deckService }) {
    this.deckService = deckService;
  }

  importDeck(params) {
    return this.deckService.importDeck(params);
  }
}
