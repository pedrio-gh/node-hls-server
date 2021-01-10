const play = async (req, res) => {
  const { channel } = req.query;
  const source = `${process.env.API_URL}/live/${channel}/index.m3u8`;
  res.render('player', { source });
};

module.exports = {
  play,
};
