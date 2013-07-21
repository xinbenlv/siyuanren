'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var validate = require('mongoose-validator').validate;
var User = require('./User');
var LoginHistorySchema = new Schema({
  timestamp: Date,
  userId: Schema.ObjectId,
  ipAddress: {type: String, required: true},
  userAgent: {type: String, required: true}
});

module.exports = mongoose.model('LoginHistory', LoginHistorySchema);