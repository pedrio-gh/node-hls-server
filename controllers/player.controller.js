const { getHlsSession } = require('../services/iptv/iptv.service');

const index = async (req, res) => {
  const { channel } = req.query;

  const hlsSession = getHlsSession(channel);
  const source = `${process.env.HLS_SOURCE}/${channel}/index.m3u8`;
  res.render('player', { source });
};

module.exports = {
  index,
};
