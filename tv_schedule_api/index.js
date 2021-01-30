const bent = require('bent')('json');
const qs = require('qs');
const { todayString } = require('../lib/utils');

let scheduleJSON;

const API_1_URL = 'https://www.movistarplus.es/programacion-tv';
const API_2_URL = 'https://comunicacion.movistarplus.es/wp-admin/admin-ajax.php';

/**
 * Fetch complete schedule for every available tv channel for the given date
 * @param {*} date YYYY-MM-DD
 */
const fetchCompleteTvSchedule = async (date) => {
  if (!date) { date = todayString(); }

  if (scheduleJSON?.date !== date) {
    scheduleJSON = await bent(`${API_1_URL}/${date}?v=json`);
    scheduleJSON.date = date;
  }

  return scheduleJSON;
};

/**
 * Fetch channels schedule for given options
 * @param {*} options
 */
const fetchMovistarTvSchedule = async ({ day, channels = null }) => {
  const schedule = await bent(API_2_URL, 'POST',
    { 'Content-Type': 'application/x-www-form-urlencoded' },
    qs.stringify({
      action: 'getProgramation',
      channels,
      day,
    }));

  return schedule;
};

const fetchChannels = async () => {
  const channels = await bent(API_2_URL, 'POST',
    { 'Content-Type': 'application/x-www-form-urlencoded' },
    qs.stringify({ action: 'getChannels' }));

  return channels;
};

module.exports = {
  fetchCompleteTvSchedule,
  fetchChannels,
  fetchMovistarTvSchedule,
};
