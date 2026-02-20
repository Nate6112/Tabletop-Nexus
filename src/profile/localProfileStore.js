import fs from 'node:fs';
import path from 'node:path';

const ensureDir = (dir) => fs.mkdirSync(dir, { recursive: true });

export class LocalProfileStore {
  constructor({ baseDir = '.local-data' } = {}) {
    this.baseDir = baseDir;
    this.profilePath = path.join(baseDir, 'profile.json');
  }

  init() {
    ensureDir(this.baseDir);
    if (!fs.existsSync(this.profilePath)) {
      this.save({
        username: null,
        avatar: 'default',
        stats: {
          matchesPlayed: 0,
          wins: 0,
          losses: 0
        },
        decks: []
      });
    }
  }

  load() {
    this.init();
    return JSON.parse(fs.readFileSync(this.profilePath, 'utf8'));
  }

  save(profile) {
    ensureDir(this.baseDir);
    fs.writeFileSync(this.profilePath, JSON.stringify(profile, null, 2));
  }

  upsertIdentity({ username, avatar = 'default' }) {
    if (!username || !username.trim()) throw new Error('username is required');
    const profile = this.load();
    profile.username = username.trim();
    profile.avatar = avatar;
    this.save(profile);
    return profile;
  }

  saveDeck(deck) {
    const profile = this.load();
    profile.decks.push(deck);
    this.save(profile);
    return deck;
  }
}
