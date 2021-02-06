const fs = require('fs');
const mkdirp = require('mkdirp');
const http = require('http');

const defaultConfig = require('./defaultConfig.json');
const Logger = require('./logger');
const HLSSession = require('./hlsSession');
const requestHandler = require('./requestHandler');

class HLSServer {
  constructor (config = defaultConfig) {
    this.server = null;
    this.config = { ...defaultConfig, ...config }; ;
    this.hlsSessions = new Map();
  }

  run () {
    try {
      mkdirp.sync(this.config.mediaPath);
      fs.accessSync(this.config.mediaPath, fs.constants.W_OK);
    } catch (error) {
      Logger.error(`HLS server startup failed. MediaRoot:${this.config.mediaPath} cannot be written.`);
      return;
    }

    const port = this.config.port || 8080;
    this.server = http.createServer(requestHandler(this.config, this.hlsSessions));

    this.server.listen(port, (error) => {
      if (error) {
        Logger.error('HLS server startup failed. Problem creating http server', error);
      } else {
        Logger.debug(`HLS Server successfully started, listening on port ${this.config.port}, ready to start HLS sessions...`);
      }
    });
  }

  addStream (name, input) {
    if (!this.hlsSessions.has(name)) {
      const hlsSession = new HLSSession(name, input, this.config);
      hlsSession.run();
      this.hlsSessions.set(name, hlsSession);

      hlsSession.on('end', (name) => {
        this.hlsSessions.delete(name);
      });
    }
  }

  stopStream (name) {
    if (this.hlsSessions.has(name)) {
      const session = this.hlsSessions.get(name);
      session.stop();
      this.hlsSessions.delete(name);
    } else {
      Logger.warning('Stream not found: ' + name);
    }
  }
}

module.exports = HLSServer;
