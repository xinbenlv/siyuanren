var colorLogger = require('tracer').colorConsole();
var log4jsLogger = require('log4js').getDefaultLogger();

module.exports = {
  colorLogger: colorLogger,
  log4jsLogger: log4jsLogger,
  default: log4jsLogger
};
