const fs = require('fs');
const path = require('path');

const { snakeCase } = require('lodash');

const SportsApiClient = require('../../sportsdb_api/client');
const TvScheduleAPI = require('../../tv_schedule_api');

const Utils = require('../../lib/utils');

const LEAGUES = require('./leagues.json');

const CHANNELS = ['MLIGA-CODE', 'MLIG1-CODE', 'MLIG2-CODE', 'MLIG3-CODE', 'MVF1-CODE', 'CHAPIO-CODE', 'CHAP1-CODE', 'CHAP2-CODE', 'CHAP3-CODE', 'M1SD-CODE', 'M2SD-CODE', 'VAMOSD-CODE', 'C4-CODE', 'GOL-CODE', 'T5-CODE'];

const client = new SportsApiClient({ apiKey: process.env.SPORTS_DB_API_KEY });

function findEventChannels(schedule, event) {
  return Object.keys(schedule).find((ch) => CHANNELS.includes(ch)
  && schedule[ch].PROGRAMAS.find((pr) => pr.CODIGO_GENERO === 'DP'
  && pr.DIRECTO
  && (snakeCase(pr.TITULO).includes(snakeCase(event.strHomeTeam))
  || snakeCase(pr.TITULO).includes(snakeCase(event.strAwayTeam)))));
}

const fetchTodayListing = async () => {
  const listingPath = path.join(__dirname, 'todayListing.json');
  const todayListingFile = fs.readFileSync(listingPath);

  let todayListingJSON = JSON.parse(todayListingFile);

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
      event.channel = findEventChannels(schedule, event) || 'no_channel';
    });

    return {
      id: league.id,
      info: infoResponse.leagues[0],
      events,
    };
  });

  todayListingJSON = await Promise.all(apiRequests);
  todayListingJSON.timestamp = Date.now();
  fs.writeFileSync(listingPath, JSON.stringify(todayListingJSON));

  return todayListingJSON;
};

module.exports = {
  fetchTodayListing,
};
