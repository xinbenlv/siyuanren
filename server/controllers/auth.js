var passport =  require('passport')
    , User = require('../models/User.js')
    , LocalStrategy =   require('passport-local').Strategy
    , GoogleStrategy = require('passport-google').Strategy
    , constants =       require('../../shared/constants')
    , logger    =       require('log4js').getDefaultLogger()
    , userRoles = require('../../client/js/routingConfig').userRoles
    ;

module.exports = {
    register: function(req, res, next) {
        logger.debug('receiving register request:');
        if (!constants.OPEN_REGISTRATION)
          return res.send(400, '注册尚未开放，请联系管理员');
        req.body.password = req.body.password || require("randomstring").generate(20);
        req.body.role = userRoles.user;
        try {
          User.validate(req.body);
        }
        catch(err) {
            return res.send(400, err.message);
        }

        User.register(
          {username:req.body.username}, req.body.password,
          function(err, user) {
            if(err === 'UserAlreadyExists') return res.send(403, "User already exists");
            else if(err)                    return res.send(400, err.message);
            user.setRole(req.body.role);
            user.save(function(err) {
              req.logIn(user, function(err) {
                  if(err)     { next(err); }
                  else        { res.json(200, { "role": user.role, "username": user.username }); }
              });
            });
        });
    },

    login: function(req, res, next) {
        passport.authenticate('local', function(err, user) {
            if(err)     { return next(err); }
            if(!user)   { return res.send(400); }

          req.logIn(user, {}, function(err) {
              if(err) {
                  return next(err);
              }
              if(req.body.rememberme && req.session.cookie) req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7;
              res.json(200, { "role": user.role, "username": user.username });
          });
        })(req, res, next);
    },

    logout: function(req, res) {
        req.logout();
        res.send(200);
    },

    localStrategy: new LocalStrategy(User.authenticate()),

    googleStrategy: function() {

      return new GoogleStrategy({
          returnURL: constants.GOOGLE_AUTH_RETURN,
          realm: constants.HOST_ROOL_URL
        },
        function(identifier, profile, done) {
          module.exports.findOrCreateOauthUser('google', identifier, done);
        });
    },

    findOrCreateOauthUser : function(provider, providerId, callback) {
      var query = {};
      query['auth.' + provider + '.providerId'] = providerId;
      User.findByUsername(provider + '_user', function(err, user) {
        // TODO(zzn): migrate to Q promises and handle err accordingly
        if (err) {
          //TODO(zzn) make sure it is that we find a user

        } else {
          if (user !=null){
            callback(null, user);
          } else {

            User.register({username:provider + '_user'}, provider + '_password', function(err, user) {
              if(err === 'UserAlreadyExists') return res.send(403, "User already exists");
              else if(err)                    return res.send(400, err.message);
              user.setRole(userRoles.user);
              user.save(function(err) {
                callback(null, user);
              });
            });
          }
        }
      });
    },

    getStrategy : function(provider) {
      return new constants.STRATEGIES[provider]({
          clientID: constants.PROVIDER_CREDENTIALS[provider].app_id,
          clientSecret: constants.PROVIDER_CREDENTIALS[provider].app_secret,
          consumerKey: constants.PROVIDER_CREDENTIALS[provider].app_id,     // Some strategy call it different name
          consumerSecret: constants.PROVIDER_CREDENTIALS[provider].app_secret,
          callbackURL: constants.PROVIDER_CREDENTIALS[provider].app_auth_callback_url
        },
        function(accessToken, refreshToken, profile, done) {
          console.log('profile:' + JSON.stringify(profile));
          module.exports.findOrCreateOauthUser(profile.provider, profile.id, done);
        });
    }
};