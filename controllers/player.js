const play = async (req, res) => {
  const { channel } = req.query;
  const source = `${process.env.HLS_SOURCE}/${channel}/index.m3u8`;
  res.render('player', { source });
};

module.exports = {
  play,
};
