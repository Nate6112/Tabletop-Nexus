import dgram from 'node:dgram';

const DEFAULT_PORT = 50505;
const DISCOVERY_PREFIX = 'TTN_DISCOVERY_V1';

export const encodeDiscovery = (payload) => `${DISCOVERY_PREFIX}|${JSON.stringify(payload)}`;

export const decodeDiscovery = (message) => {
  const raw = String(message);
  if (!raw.startsWith(`${DISCOVERY_PREFIX}|`)) return null;
  return JSON.parse(raw.slice(DISCOVERY_PREFIX.length + 1));
};

export class LanDiscovery {
  constructor({ port = DEFAULT_PORT } = {}) {
    this.port = port;
    this.socket = null;
  }

  startListening(onAnnouncement) {
    this.socket = dgram.createSocket('udp4');
    this.socket.on('message', (msg) => {
      const decoded = decodeDiscovery(msg);
      if (decoded) onAnnouncement(decoded);
    });
    this.socket.bind(this.port, () => {
      this.socket.setBroadcast(true);
    });
  }

  broadcast(payload) {
    const message = Buffer.from(encodeDiscovery(payload));
    const socket = dgram.createSocket('udp4');
    socket.bind(() => {
      socket.setBroadcast(true);
      socket.send(message, 0, message.length, this.port, '255.255.255.255', () => {
        socket.close();
      });
    });
  }

  stop() {
    if (this.socket) this.socket.close();
  }
}
