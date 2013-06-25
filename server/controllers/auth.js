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
            if (req.body.provider) {
              user.auth[req.body.provider] = {
                id: req.body.oauth.profile.id,
                token: req.body.oauth.token
              };
            }

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
      query['auth.' + provider + '.id'] = providerId;
      User.find(query, function(err, users) {
        if (users.length == 1) {
          logger.info('Found a current user');
          var client_user = {};
          client_user['id'] = 0;
          client_user['siyuanid'] = user.siyuanid;
          client_user['username'] = user.username;
          client_user['role'] = user.role;
          callback(null, client_user);
        } else if (users.length == 0) {
          logger.info('Start Registration');
          var client_user = {};
          client_user['id'] = 0;
          client_user['username'] = 'anonymous_' + provider + '_user';
          client_user['provider'] = provider;
          client_user['providerId'] = providerId;
          client_user['role'] = userRoles.public;
          callback(null, client_user);
        } else {
          var msg = 'Gosh, we found more user with same Id';
          logger.error(msg);
          callback(msg, null);
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
    },

    serializeUser: function(user, done) {
      done(null, user); // TODO(zzn): use some smarter way to serialize not registered account
    },

    deserializeUser: function(oauthUser, done) {
      var id = oauthUser.id;
      if (id == 0) {
        done(null, oauthUser);
      } else {
        User.findById(id, function(err, user) {
          if(user)    { done(null, user); }
          else        { done(null, false); }
        });
      }
    }
};