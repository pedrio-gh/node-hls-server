const chalk = require('chalk');

const _error = chalk.bold.red;
const _warning = chalk.bold.yellow;
const _debug = chalk.green;

const time = () => {
  const date = new Date();
  return `[${date.toLocaleDateString()} ${date.toLocaleTimeString()}]`;
};

const error = (...args) => {
  console.log(_error(time(), ...args));
};

const warning = (...args) => {
  console.log(_warning(time(), ...args));
};

const debug = (...args) => {
  console.log(_debug(time(), ...args));
};

module.exports = {
  error,
  warning,
  debug
};
