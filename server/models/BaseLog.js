'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var validate = require('mongoose-validator').validate;
var User = require('./User');

var BaseLog = new Schema({
  timestamp: Date,
  msg: Object  // Tracer log message
});

module.exports = mongoose.model('BaseLog', BaseLog, 'logs');;
