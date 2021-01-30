const { EventEmitter } = require('events');

class IPTV extends EventEmitter {
  constructor(name, list) {
    super();
    this.name = name;
    this.list = list;
    this.active = false;
  }

  activate() {
    this.active = true;
    this.emit('iptv_on', this);
  }

  deactivate() {
    this.active = false;
    this.emit('iptv_off', this);
  }

  getChannels() {
    return this.list.segments;
  }
}

module.exports = IPTV;
