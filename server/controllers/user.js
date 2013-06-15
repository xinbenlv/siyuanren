var _ =           require('underscore')
    , User =      require('../models/User.js')
    , userRoles = require('../../client/js/routingConfig').userRoles

  ;

module.exports = {
    index: function(req, res) {
        var users = User.findAll();
        _.each(users, function(user) {
            delete user.password;
            for(i in constants.ENABED_PROVIDERS){
              delete user[provider[i]];
            }
            delete user.google;
        });
        res.json(users);
    }
};