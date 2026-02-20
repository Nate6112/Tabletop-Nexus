import fs from 'node:fs';
import path from 'node:path';

export class OfflineAssetAgent {
  constructor({ cacheDir = '.local-data/cache' } = {}) {
    this.cacheDir = cacheDir;
  }

  ensureCacheDirs() {
    fs.mkdirSync(path.join(this.cacheDir, 'mtg'), { recursive: true });
    fs.mkdirSync(path.join(this.cacheDir, 'ygo'), { recursive: true });
    fs.mkdirSync(path.join(this.cacheDir, 'pokemon'), { recursive: true });
  }

  cacheJson(rulesetId, fileName, data) {
    this.ensureCacheDirs();
    const filePath = path.join(this.cacheDir, rulesetId, fileName);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return filePath;
  }
}
