const send = require('send');
const path = require('path');
const logger = require('./logger');

module.exports = (mediaPath) => (req, res) => {
  const { url, method } = req;

  if (method === 'GET') {
    const filePath = path.resolve(mediaPath + url);
    if (filePath.endsWith('.m3u8') || filePath.endsWith('.ts')) {
      send(req, filePath)
        .on('error', (err) => logger.error('Error serving ' + filePath, err))
        .pipe(res);
    } else {
      res.status(400).end();
    }
  } else {
    res.status(400).end();
  }
};
