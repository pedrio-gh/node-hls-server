const SportsApiClient = require('../sportsdb_api/client');

const client = new SportsApiClient({ apiKey: process.env.SPORTS_DB_API_KEY });
const { todayString } = require('../lib/dateUtils');

const LEAGUES = ['Spanish_La_Liga', 'La_Liga_2'];
const index = async (req, res) => {
  const today = todayString();

  const leaguesWithEvents = await Promise.all(LEAGUES.map(async (league) => {
    let { events } = await client.eventsOnDay({ day: today, league });
    events = events.sort((ev1, ev2) => {
      const t1 = new Date(ev1.strTimestamp);
      const t2 = new Date(ev2.strTimestamp);

      return t1 - t2;
    });

    const info = await client.leagueInfo(events[0].idLeague);

    return {
      info: info.leagues[0],
      channel: 'MLIGA',
      events,
    };
  }));

  res.render('index', { leaguesWithEvents });
};

module.exports = {
  index,
};
