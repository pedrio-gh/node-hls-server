const IPTV = require('./iptv');
const {
  loadFromFile, fileName, isFolder, isValidPath,
} = require('./utils');

class IptvHandler {
  constructor() {
    this.active = new Set();
    this.inactive = new Set();
  }

  async loadIptv(path) {
    if (!isValidPath(path) || isFolder(path)) {
      throw new Error('Invalid path');
    }

    const name = fileName(path);
    const list = await loadFromFile(path);
    const iptv = new IPTV(name, list);

    iptv.on('iptv_on', (iptv) => {
      console.log('Activating IPTV');
      this.inactive.delete(iptv);
      this.active.add(iptv);
    });

    iptv.on('iptv_off', (iptv) => {
      console.log('Deleting active IPTV');
      this.active.delete(iptv);
      this.inactive.add(iptv);
    });

    this.inactive.add(iptv);
  }

  getIptvs() {
    return {
      active: this.active,
      inactive: this.inactive,
    };
  }

  getAvailableIptv() {
    return this.inactive.values().next().value;
  }
}

module.exports = IptvHandler;
