/**
 * Created with JetBrains WebStorm.
 * User: zzn
 * Date: 6/9/13
 * Time: 2:57 PM
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
  email: String,
  enabled: { type: Boolean, default: false },
  isGlobalAdmin: { type: Boolean, default: false },
  verificationRandomToken: String
});


User.methods.resetVerificationRandomToken = function(){
  this.verificationRandomToken = require("randomstring").generate(32);
};

User.plugin(passportLocalMongoose);

/**
 *
 * @type {User} a model of user
 */
module.exports = mongoose.model('User', User);
