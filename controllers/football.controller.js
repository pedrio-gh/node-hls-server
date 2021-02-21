const FootballService = require('../services/football/football.service.js');

const index = async (req, res) => {
  let leaguesWithEvents = await FootballService.fetchTodayListing();

  // Filter empty leagues
  leaguesWithEvents = leaguesWithEvents.filter((league) => league.events.length > 0);

  // Order events by start time
  leaguesWithEvents.forEach((league) => {
    league.events = league.events.filter((ev) => ev.channel !== 'no_channel');
    league.events.sort((ev1, ev2) => new Date(ev1.strTimestamp) - new Date(ev2.strTimestamp));
  });



  res.render('football/section', { leaguesWithEvents });
};

module.exports = {
  index,
};
