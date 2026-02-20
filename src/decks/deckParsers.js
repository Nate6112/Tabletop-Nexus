const cleanLine = (line) => line.trim();

const parseQuantityLine = (line) => {
  const [count, ...nameParts] = line.split(/\s+/);
  return { quantity: Number(count), name: nameParts.join(' ') };
};

export function parseArenaOrMtgoTxt(input) {
  const cards = input
    .split('\n')
    .map(cleanLine)
    .filter((line) => line && !line.startsWith('//'))
    .map(parseQuantityLine)
    .filter((entry) => entry.quantity > 0 && entry.name.length > 0);

  return { format: 'txt', cards };
}

export function parseYdk(input) {
  const cards = [];
  let section = 'main';

  for (const rawLine of input.split('\n')) {
    const line = cleanLine(rawLine);
    if (!line) continue;

    if (line === '#main') {
      section = 'main';
      continue;
    }

    if (line === '#extra') {
      section = 'extra';
      continue;
    }

    if (line === '!side') {
      section = 'side';
      continue;
    }

    if (line.startsWith('#') || line.startsWith('!')) continue;

    cards.push({ section, passcode: line });
  }

  return { format: 'ydk', cards };
}

export function parsePokemonPkd(input) {
  const cards = input
    .split('\n')
    .map(cleanLine)
    .filter(Boolean)
    .map(parseQuantityLine)
    .filter((entry) => entry.quantity > 0 && entry.name.length > 0);

  return { format: 'pkd', cards };
}

export function parseDeckByExtension(extension, input) {
  switch (extension.toLowerCase()) {
    case 'txt':
      return parseArenaOrMtgoTxt(input);
    case 'ydk':
      return parseYdk(input);
    case 'pkd':
      return parsePokemonPkd(input);
    default:
      throw new Error(`Unsupported deck format: ${extension}`);
  }
}
