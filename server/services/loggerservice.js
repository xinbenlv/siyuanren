var colorLogger = require('tracer').colorConsole();
var log4jsLogger = require('log4js').getDefaultLogger();
var BaseLog = require('../models/BaseLog');

var dbLogger = require('tracer').console({
  transport : function(msg) {
    var log = new BaseLog({
      timestamp: new Date(),
      msg: msg
      });
    log.save(function (err) {
      if (err) // ...
        console.log('Error saving msg: ' + JSON.stringify(msg));
    });
  }
});

module.exports = {
  colorLogger: colorLogger,
  log4jsLogger: log4jsLogger,
  dbLogger: dbLogger,
  default: process.env.NODE_ENV == 'production' ? dbLogger : colorLogger
};
