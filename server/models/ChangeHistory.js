var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var extend = require('mongoose-schema-extend');
var Schema = mongoose.Schema;
var BaseLog = require('./BaseLog');

var ChangeHistory = new Schema({
  timestamp: Date,
  user: ObjectId,
  fieldPath: String,
  fieldValue: String
});

module.exports = mongoose.model('ChangeHistory', ChangeHistory, 'changeHistory');

