var User
    , _ =               require('underscore')
    , passport =        require('passport')
    , mongoose =        require('mongoose')
    , Schema   =        mongoose.Schema
    , passportLocalMongoose = require('passport-local-mongoose')
    , check =           require('validator').check
    , userRoles =       require('../../client/js/routingConfig').userRoles

var userSchema = new Schema({
  role: { type: userRoles } ,
  auth: { String: {} }
});
userSchema.methods.setRole = function(role) {
  this.role = role;
};

userSchema.methods.resetVerificationRandomToken = function(){
  this.verificationRandomToken = require("randomstring").generate(32);
};

userSchema.statics.findOrCreateOauthUser = function(provider, providerId, callback) {
  var query = {};
  query['auth.' + provider + '.providerId'] = providerId;
  this.upsert(query, function(err, user) {
    // TODO(zzn): migrate to Q promises and handle err accordingly
    if (err) callback(err, null);
    else callback(null, user);
  });
};

userSchema.statics.findByProviderId = function(provider, id, callback) {
  var query = {};
  query['auth.' + provider + '.providerId'] = providerId;
  query['id'] = id;
  User.find(query, function(err, users){
    if (err) callback(err, null);
    else callback(null, users);
  })
};

userSchema.statics.validate = function(user) {
  check(user.username, 'Username must be 1-20 characters long').len(1, 20);
  check(user.password, 'Password must be 5-60 characters long').len(5, 60);
  check(user.username, 'Invalid username').not(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/);

  // TODO: Seems node-validator's isIn function doesn't handle Number arrays very well...
  // Till this is rectified Number arrays must be converted to string arrays
  // https://github.com/chriso/node-validator/issues/185
  var stringArr = _.map(_.values(userRoles), function(val) { return val.toString() });
  check(user.role, 'Invalid user role given').isIn(stringArr);
};

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
