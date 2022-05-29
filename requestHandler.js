const send = require('send');
const path = require('path');
const logger = require('./logger');

module.exports = (config, hlsSessions) => (req, res) => {
  const { cors, mediaPath } = config;
  const { url, method } = req;

  Object.keys(cors).forEach(corsOption => {
    res.setHeader(corsOption, cors[corsOption]);
  });

  try {
    if (method !== 'GET') throw new Error('Only GET method is supported')

    const filePath = path.resolve(mediaPath + url);
    if (!(filePath.endsWith('.m3u8') || filePath.endsWith('.ts'))) throw new Error('Bad extension file requested')

    send(req, filePath)
      .on('error', (err) => logger.error('Error serving ' + filePath, err))
      .pipe(res);

    const sessionID = url.split('/')[1];
    const hlsSession = hlsSessions.get(sessionID);

    if (!hlsSession) throw new Error('Stream not found')

    const requestIp = (typeof req.headers['x-forwarded-for'] === 'string' && req.headers['x-forwarded-for'].split(',').shift()) ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      req.connection?.socket?.remoteAddress;

    hlsSession.addViewer(requestIp);
    hlsSession.updateLastRequestAt();
  } catch (error) {
    logger.error('Error on request ', error)
    res.statusCode = 400;
    res.end(String(error));
  }
};
