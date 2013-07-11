var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var extend = require('mongoose-schema-extend');
var Schema = mongoose.Schema;
var BaseLog = require('./BaseLog');

var PeopleTableLog = mongoose.model('BaseLog').extend({
  user : ObjectId,   //Refer to a user
  fieldPath: String // The field it changed to
});

module.exports = mongoose.model('PeopleTableLog', PeopleTableLog, 'logs');

