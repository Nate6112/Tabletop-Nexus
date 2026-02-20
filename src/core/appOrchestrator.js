import { SessionManager } from './sessionManager.js';
import { LocalProfileStore } from '../profile/localProfileStore.js';
import { DeckService } from '../deck/deckService.js';
import { LobbyDirectory } from '../lobby/lobbyDirectory.js';
import { LanDiscovery } from '../network/lanDiscovery.js';
import { OfflineAssetAgent } from '../offline/offlineAssetAgent.js';
import { HostAgent } from '../agents/hostAgent.js';
import { ClientAgent } from '../agents/clientAgent.js';
import { DeckManagementAgent } from '../agents/deckManagementAgent.js';
import { LobbyAgent } from '../agents/lobbyAgent.js';
import { SearchDiscoveryAgent } from '../agents/searchDiscoveryAgent.js';
import { ReplayUndoAgent } from '../agents/replayUndoAgent.js';

export class AppOrchestrator {
  constructor() {
    const sessionManager = new SessionManager();
    const profileStore = new LocalProfileStore();
    const deckService = new DeckService(profileStore);
    const discovery = new LanDiscovery();
    const lobbyDirectory = new LobbyDirectory();

    this.profileStore = profileStore;
    this.offlineAssetAgent = new OfflineAssetAgent();
    this.hostAgent = new HostAgent({ sessionManager, discovery, lobbyDirectory });
    this.clientAgent = new ClientAgent({ sessionManager });
    this.deckManagementAgent = new DeckManagementAgent({ deckService });
    this.lobbyAgent = new LobbyAgent({ discovery, lobbyDirectory });
    this.searchDiscoveryAgent = new SearchDiscoveryAgent({ lobbyDirectory });
    this.replayUndoAgent = new ReplayUndoAgent();
  }
}
