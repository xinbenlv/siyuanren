var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var extend = require('mongoose-schema-extend');
var Schema = mongoose.Schema;
var BaseLog = require('./BaseLog');

var ChangeHistory = new Schema({
  timestamp: Date,
  user: {type: ObjectId, ref: 'User'},
  siyuanUserProfile: {type: ObjectId, ref: 'SiyuanUserProfile'},
  fieldSet: Object
});

module.exports = mongoose.model('ChangeHistory', ChangeHistory, 'changeHistory');

