const { snakeCase } = require('lodash');

const FREE_CHANNELS = {
  gol_television: 'https://goltelevision.com/live',
  cuatro: 'https://www.cuatro.com/en-directo/',
};

const play = async (req, res) => {
  let { channel } = req.query;
  channel = Buffer.from(channel, 'base64').toString('utf-8');
  channel = snakeCase(channel);

  if (Object.keys(FREE_CHANNELS).includes(channel)) {
    res.redirect(FREE_CHANNELS[channel]);
    return null;
  }

  const source = `${process.env.HLS_SOURCE}/${channel}/index.m3u8`;
  res.render('player', { source });
};

module.exports = {
  play,
};
