import { parseDeckByExtension } from '../decks/deckParsers.js';
import { RulesetRegistry } from '../rules/rulesetRegistry.js';

export class DeckService {
  constructor(profileStore) {
    this.profileStore = profileStore;
  }

  importDeck({ rulesetId, extension, content, name }) {
    const parsed = parseDeckByExtension(extension, content);
    const ruleset = RulesetRegistry.require(rulesetId);
    const validation = ruleset.validateDeck(parsed);
    if (!validation.valid) {
      throw new Error(validation.errors.join('; '));
    }

    const deck = {
      id: `${rulesetId}-${Date.now()}`,
      name: name ?? 'Imported Deck',
      rulesetId,
      format: extension,
      cards: parsed.cards,
      validation
    };

    this.profileStore.saveDeck(deck);
    return deck;
  }
}
