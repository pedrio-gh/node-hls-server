const { snakeCase } = require('lodash');

const play = async (req, res) => {
  let { channel } = req.query;
  channel = Buffer.from(channel, 'base64').toString('utf-8');
  channel = snakeCase(channel);

  const source = `${process.env.HLS_SOURCE}/${channel}/index.m3u8`;
  res.render('player', { source });
};

module.exports = {
  play,
};
