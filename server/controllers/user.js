var _ =           require('underscore')
    , User =      require('../models/User.js')
    , userRoles = require('../../client/js/routingConfig').userRoles
    , constants = require('../../shared/constants')
  ;

module.exports = {
    index: function(req, res) {
        User.find({}, function(err, users){
          _.each(users, function(user) {
              delete user.password;
              for(var i in constants.ENABED_PROVIDERS){
                var provider = constants.ENABED_PROVIDERS[i];
                delete user[provider[i]];
              }
              delete user.google;
          });
          res.json(users);
        });
    }
};