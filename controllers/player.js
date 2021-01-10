const play = async (req, res) => {
  const { channel } = req.params;
  const source = `${process.env.API_URL}/live/${channel}.m3u8`;
  res.render('player', { source });
};

module.exports = {
  play,
};
