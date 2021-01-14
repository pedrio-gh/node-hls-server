const bent = require('bent');
const qs = require('querystring');

class SportsDbClient {
  constructor(config) {
    this.basePath = `https://www.thesportsdb.com/api/v1/json/${config.apiKey}`;
  }

  request(endpoint, params) {
    const get = bent(this.basePath, 'GET', 'json', 200);
    return get(`${endpoint}?${qs.encode(params)}`);
  }

  // LOOKUPS

  tvEventByEventId(eventId) {
    return this.request('/lookuptv.php', { id: eventId });
  }

  leagueInfo(leagueId) {
    return this.request('/lookupleague.php', { id: leagueId });
  }

  // SCHEDULES

  nextEvents(leagueId) {
    return this.request('/eventsnextleague.php', { id: leagueId });
  }

  lastEvents(leagueId) {
    return this.request('/eventspastleague.php', { id: leagueId });
  }

  eventsOnDay({ day = null, sport = null, league = null }) {
    return this.request('/eventsday.php', {
      d: day,
      s: sport,
      l: league,
    });
  }

  tvEventsOnDay({ day, sport, country }) {
    return this.request('/eventstv.php', {
      d: day,
      s: sport,
      c: country,
    });
  }

  tvEventsOnChannel(channel) {
    return this.request('/eventstv.php', { c: channel });
  }
}

module.exports = SportsDbClient;
