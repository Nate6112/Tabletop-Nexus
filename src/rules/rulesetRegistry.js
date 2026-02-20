const makeBaseRuleset = ({ id, name, zones, actions, turnFlow }) => ({
  id,
  name,
  zones,
  actions,
  turnFlow,
  validateDeck: (deck) => {
    if (!deck || !Array.isArray(deck.cards) || deck.cards.length === 0) {
      return { valid: false, errors: ['Deck is empty.'] };
    }
    return { valid: true, errors: [] };
  }
});

export const mtgRuleset = makeBaseRuleset({
  id: 'mtg',
  name: 'Magic: The Gathering',
  zones: ['library', 'hand', 'battlefield', 'graveyard', 'exile', 'command', 'stack'],
  actions: ['cast', 'activate', 'declare-attackers', 'declare-blockers', 'resolve-stack', 'tap', 'untap'],
  turnFlow: ['beginning', 'main1', 'combat', 'main2', 'ending']
});

export const ygoRuleset = makeBaseRuleset({
  id: 'ygo',
  name: 'Yu-Gi-Oh!',
  zones: ['deck', 'hand', 'monster-zones', 'spell-trap-zones', 'extra-deck', 'graveyard', 'banished'],
  actions: ['normal-summon', 'special-summon', 'set', 'activate', 'battle', 'chain-resolve'],
  turnFlow: ['draw', 'standby', 'main1', 'battle', 'main2', 'end']
});

export const pokemonRuleset = makeBaseRuleset({
  id: 'pokemon',
  name: 'Pokémon TCG',
  zones: ['deck', 'hand', 'active', 'bench', 'prize-cards', 'discard', 'lost-zone'],
  actions: ['attach-energy', 'play-trainer', 'retreat', 'attack', 'draw-prize', 'coin-flip'],
  turnFlow: ['draw', 'main', 'attack', 'checkup']
});

const rulesets = new Map([
  [mtgRuleset.id, mtgRuleset],
  [ygoRuleset.id, ygoRuleset],
  [pokemonRuleset.id, pokemonRuleset]
]);

export const RulesetRegistry = {
  list: () => Array.from(rulesets.values()),
  get: (id) => rulesets.get(id),
  require: (id) => {
    const found = rulesets.get(id);
    if (!found) throw new Error(`Unknown ruleset: ${id}`);
    return found;
  }
};
