const send = require('send');
const path = require('path');
const logger = require('./logger');

module.exports = (config, hlsSessions) => (req, res) => {
  const { cors, mediaPath } = config;
  const { url, method } = req;

  Object.keys(cors).forEach(corsOption => {
    res.setHeader(corsOption, cors[corsOption]);
  });

  if (method === 'GET') {
    const filePath = path.resolve(mediaPath + url);
    if (filePath.endsWith('.m3u8') || filePath.endsWith('.ts')) {
      send(req, filePath)
        .on('error', (err) => logger.error('Error serving ' + filePath, err))
        .pipe(res);

      const sessionID = url.split('/')[1];
      const hlsSession = hlsSessions.get(sessionID);
      hlsSession.addViewer(req.socket.remoteAddress);
      hlsSession.updateLastRequestAt();
    } else {
      res.statusCode = 400;
      res.end();
    }
  } else {
    res.statusCode = 400;
    res.end();
  }
};
