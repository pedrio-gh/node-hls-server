const { snakeCase } = require('lodash');
const SportsApiClient = require('../sportsdb_api/client');

const client = new SportsApiClient({ apiKey: process.env.SPORTS_DB_API_KEY });
const { todayString } = require('../lib/dateUtils');

const CHANNELS = ['bW92aXN0YXJfbGFfbGlnYV8x'];
// [movistar_la_liga_1]

const LEAGUES = ['Spanish_La_Liga'];

const index = async (req, res) => {
  const today = todayString();

  const leaguesWithEvents = await Promise.all(LEAGUES.map(async (league) => {
    let { events } = await client.eventsOnDay({ day: today, league });
    events = events || [];

    events = await Promise.all(events.map(async (event) => {
      const { tvevent } = await client.tvEventByEventId(event.idEvent);
      event.channels = tvevent?.filter((tv) => CHANNELS.includes(tv.strChannel));
      return event;
    }));

    events = events.sort((ev1, ev2) => {
      const t1 = new Date(ev1.strTimestamp);
      const t2 = new Date(ev2.strTimestamp);
      return t1 - t2;
    });

    if (events.length === 0) { return null; }

    const info = await client.leagueInfo(events[0].idLeague);
    return { info: info.leagues[0], events };
  }));

  res.render('index', { leaguesWithEvents });
};

module.exports = {
  index,
};
