const FootballService = require('../services/football/football.service.js');

const index = async (req, res) => {
  let leaguesWithEvents = await FootballService.todayListing();

  leaguesWithEvents = leaguesWithEvents.filter((league) => league.events.length > 0);

  res.render('football/section', { leaguesWithEvents });
};

module.exports = {
  index,
};
