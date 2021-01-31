const SportsApiClient = require('../../sportsdb_api/client');
const TvScheduleAPI = require('../../tv_schedule_api');

const Utils = require('../../lib/utils');

const LEAGUES = require('./leagues.json');

const client = new SportsApiClient({ apiKey: process.env.SPORTS_DB_API_KEY });

let todayListingJSON;

function findEventChannels(schedule, event) {
  return Object.keys(schedule).find((ch) => schedule[ch].PROGRAMAS.find((pr) => pr.CODIGO_GENERO === 'DP'
  && pr.DIRECTO
  && (pr.TITULO.includes(event.strHomeTeam)
  || pr.TITULO.includes(event.strAwayTeam))));
}

const fetchTodayListing = async () => {
  if (todayListingJSON && todayListingJSON.timestamp + 60 * 60 * 1000 > Date.now()) {
    return todayListingJSON;
  }

  const today = Utils.todayString();
  const scheduleResponse = await TvScheduleAPI.fetchCompleteTvSchedule(today);
  const schedule = scheduleResponse.data;

  const apiRequests = LEAGUES.map(async (league) => {
    const infoResponse = await client.leagueInfo(league.id);
    const eventsResponse = await client.eventsOnDay({ league: league.name, day: today });

    const events = eventsResponse.events || [];
    events.forEach((event) => {
      event.channel = findEventChannels(schedule, event);
    });

    return {
      id: league.id,
      info: infoResponse.leagues[0],
      events,
    };
  });

  todayListingJSON = await Promise.all(apiRequests);
  todayListingJSON.timestamp = Date.now();

  return todayListingJSON;
};

module.exports = {
  fetchTodayListing,
};
