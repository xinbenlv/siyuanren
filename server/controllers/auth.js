var passport =  require('passport')
    , User = require('../models/User.js')
    , LocalStrategy =   require('passport-local').Strategy
    , TwitterStrategy = require('passport-twitter').Strategy
    , FacebookStrategy = require('passport-facebook').Strategy
    , GoogleStrategy = require('passport-google').Strategy
    , LinkedInStrategy = require('passport-linkedin').Strategy
    , constants =       require('../../shared/constants')
    , logger    =       require('log4js').getDefaultLogger()
    ;
module.exports = {
    register: function(req, res, next) {
        try {
          User.validate(req.body);
        }
        catch(err) {
            return res.send(400, err.message);
        }

        User.register({username:req.body.username}, req.body.password, function(err, user) {
          console.log( JSON.stringify(err));
            if(err === 'UserAlreadyExists') return res.send(403, "User already exists");
            else if(err)                    return res.send(400, err.message);
            user.setRole(req.body.role);
            user.save(function(err) {
              res.json(200, { "role": user.role, "username": user.username });
//              req.logIn(user, function(err) {
//                  if(err)     { next(err); }
//                  else        { res.json(200, { "role": user.role, "username": user.username }); }
//              });
            });
        });
    },

    login: function(req, res, next) {
        logger.debug('Serverside, try to login');
        passport.authenticate('local', function(err, user) {
          logger.debug('111');
            if(err)     { return next(err); }
            if(!user)   { return res.send(400); }

          logger.debug('222xx');
          logger.debug(req.logIn.toString());

          req.logIn(user, {}, function(err) {
            logger.debug('333,1');
              if(err) {
                  return next(err);
              }
            logger.debug('333,2');
              if(req.body.rememberme && req.session.cookie) req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7;
              res.json(200, { "role": user.role, "username": user.username });
          });
          logger.debug('444');
        })(req, res, next);
    },

    logout: function(req, res) {
        req.logout();
        res.send(200);
    },

    localStrategy: new LocalStrategy(User.authenticate()),

    twitterStrategy: function() {
      if(!process.env.TWITTER_CONSUMER_KEY)    throw new Error('A Twitter Consumer Key is required if you want to enable login via Twitter.');
      if(!process.env.TWITTER_CONSUMER_SECRET) throw new Error('A Twitter Consumer Secret is required if you want to enable login via Twitter.');

      return new TwitterStrategy({
          consumerKey: process.env.TWITTER_CONSUMER_KEY,
          consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
          callbackURL: process.env.TWITTER_CALLBACK_URL || 'http://localhost:8000/auth/twitter/callback'
        },
        function(token, tokenSecret, profile, done) {
          module.exports.findOrCreateOauthUser(profile.provider, profile.id, done);
        });
    },

    facebookStrategy: function() {
      if(!process.env.FACEBOOK_APP_ID)     throw new Error('A Facebook App ID is required if you want to enable login via Facebook.');
      if(!process.env.FACEBOOK_APP_SECRET) throw new Error('A Facebook App Secret is required if you want to enable login via Facebook.');

      return new FacebookStrategy({
          clientID: process.env.FACEBOOK_APP_ID,
          clientSecret: process.env.FACEBOOK_APP_SECRET,
          callbackURL: constants.FACEBOOK_AUTH_CALLBACK
        },
        function(accessToken, refreshToken, profile, done) {
          module.exports.findOrCreateOauthUser(profile.provider, profile.id, done);
        });
    },

    googleStrategy: function() {

      return new GoogleStrategy({
          returnURL: constants.GOOGLE_AUTH_RETURN,
          realm: constants.HOST_ROOL_URL
        },
        function(identifier, profile, done) {
          module.exports.findOrCreateOauthUser('google', identifier, done);
        });
    },

    linkedInStrategy: function() {
      if(!process.env.LINKED_IN_KEY)     throw new Error('A LinkedIn App Key is required if you want to enable login via LinkedIn.');
      if(!process.env.LINKED_IN_SECRET) throw new Error('A LinkedIn App Secret is required if you want to enable login via LinkedIn.');

      return new LinkedInStrategy({
          consumerKey: process.env.LINKED_IN_KEY,
          consumerSecret: process.env.LINKED_IN_SECRET,
          callbackURL: constants.LINKED_IN_AUTH_CALLBACK
        },
        function(token, tokenSecret, profile, done) {
          module.exports.findOrCreateOauthUser('linkedin', profile.id, done);
        }
      );
    },


    findOrCreateOauthUser : function(provider, providerId, callback) {
      var query = {};
      query['auth.' + provider + '.providerId'] = providerId;
      User.upsert(query, function(err, user) {
        // TODO(zzn): migrate to Q promises and handle err accordingly
        if (err) callback(err, null);
        else callback(null, user);
      });
    }
};