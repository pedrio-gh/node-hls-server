const got = require('got');
const qs = require('qs');
const { todayString } = require('../lib/dateUtils');
let scheduleJSON = require('./schedule.json');

const API_1_URL = 'https://www.movistarplus.es/programacion-tv';
const API_2_URL = 'https://comunicacion.movistarplus.es/wp-admin/admin-ajax.php';

/**
 * Fetch complete schedule for every available tv channel for the given date
 * @param {*} date YYYY-MM-DD
 */
const fetchCompleteTvSchedule = async (date) => {
  if (!date) { date = todayString(); }

  if (scheduleJSON.date !== date) {
    scheduleJSON = await got(`${API_1_URL}/${date}?v=json`).json();
  }

  return scheduleJSON;
};

/**
 * Fetch channels schedule for given options
 * @param {*} options
 */
const fetchMovistarTvSchedule = async ({ day, channels = null }) => {
  const schedule = await got.post(API_2_URL, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: qs.stringify({
      action: 'getProgramation',
      channels,
      day,
    }),
  }).json();

  return schedule;
};

const fetchChannels = async () => {
  const channels = await got.post(API_2_URL, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: qs.stringify({ action: 'getChannels' }),
  }).json();

  return channels;
};

module.exports = {
  fetchCompleteTvSchedule,
  fetchChannels,
  fetchMovistarTvSchedule,
};
