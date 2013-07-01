'use strict';

var passport =  require('passport');
var User = require('../models/User.js');
var SiyuanUserProfile = require('../models/SiyuanUserProfile.js');
var LocalStrategy =   require('passport-local').Strategy;
var GoogleStrategy = require('passport-google').Strategy;
var constants =       require('../../shared/constants');
var logger    =       require('log4js').getDefaultLogger();
var userRoles = require('../../client/js/routingConfig').userRoles;

module.exports = {
  register: function (req, res, next) {

    //if (!constants.OPEN_REGISTRATION)
    //  return res.send(400, '注册尚未开放，请联系管理员');
    req.body.password = req.body.password || require("randomstring").generate(20);
    req.body.role = userRoles.user;
    try {
      User.validate(req.body);
    }
    catch (err) {
      return res.send(400, err.message);
    }
    User.register(
      {username: req.body.username}, req.body.password,
      function (err, user) {
        if (err === 'UserAlreadyExists') res.send(403, "User already exists");
        else if (err) res.send(400, err.message);
        else {
          user.setRole(req.body.role);
          if (req.body.meta.need_to_register) {
            for (var provider in req.body.meta.oauth) {
              user.auth.push({
                provider: provider,
                id: req.body.meta.oauth[provider].id,
                accessToken: req.body.meta.oauth[provider].accessToken,
                refreshToken: req.body.meta.oauth[provider].refreshToken
              });
            }
          }

          user.save(function (err) {
            req.logIn(user, function (err) {
              if (err) {
                next(err);
              }
              else {
                res.json(200, { "role": user.role, "username": user.username });
              }
            });
          });
        }
      });

  },

  login: function (req, res, next) {
    passport.authenticate('local', function (err, user) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.send(400);
      }
      req.logIn(user, {}, function (err) {
        if (err) {
          return next(err);
        }

        if (req.body.rememberme && req.session.cookie) req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7;
        res.json(200, { "role": user.role, "username": user.username });
      });
    })(req, res, next);
  },

  logout: function (req, res) {
    req.logout();
    res.send(200);
  },

  localStrategy: new LocalStrategy(User.authenticate()),

  googleStrategy: function () {

    return new GoogleStrategy({
        returnURL: constants.GOOGLE_AUTH_RETURN,
        realm: constants.HOST_ROOL_URL
      },
      function (identifier, profile, done) {
        module.exports.findOrCreateOauthUser('google', identifier, done);
      });
  },

  findOrCreateOauthUser: function (provider, providerId, callback) {
    //reference: http://stackoverflow.com/questions/13460765/findone-subdocument-in-mongoose
    var query = {};
    query['auth.provider'] = provider;
    query['auth.id'] = providerId;

    User.find(query, function (err, users) {
      if (users.length == 1) {
        var user = users[0];
        logger.info('Found a current user');
        var client_user = {};
        client_user._id = user._id;
        callback(null, client_user);
      } else if (users.length == 0) {
        logger.info('Start Registration');
        var client_user = {};
        client_user.id = 0;
        client_user.username = provider + '_user_' + providerId;
        client_user.role = userRoles.public;
        client_user.meta = {};
        client_user.meta.need_to_register = true;
        client_user.meta.oauth = {};
        client_user.meta.oauth[provider] = {
          id: providerId,
          token: ''
        }

        SiyuanUserProfile.find({}, '_id 姓名', function (err, docs) {
          callback(null, client_user);
        });
      } else {
        var msg = 'Gosh, we found more user with same Id';
        logger.error(msg);
        callback(msg, null);
      }
    });
  },

  getStrategy: function (provider) {
    return new constants.STRATEGIES[provider]({
        clientID: constants.PROVIDER_CREDENTIALS[provider].app_id,
        clientSecret: constants.PROVIDER_CREDENTIALS[provider].app_secret,
        consumerKey: constants.PROVIDER_CREDENTIALS[provider].app_id,     // Some strategy call it different name
        consumerSecret: constants.PROVIDER_CREDENTIALS[provider].app_secret,
        callbackURL: constants.PROVIDER_CREDENTIALS[provider].app_auth_callback_url
      },
      function (accessToken, refreshToken, profile, done) {
        module.exports.findOrCreateOauthUser(profile.provider, profile.id, done);
      });
  },

  serializeUser: function (user, done) {
    done(null, user); // TODO(zzn): use some smarter way to serialize not registered account
  },

  deserializeUser: function (data, done) {
    if (data.meta && data.meta.need_to_register) {
      done(null, data);

    } else {
      User.findById(data._id, function (err, user) {
        if (user) {
          if (data.meta) user.meta = data.meta;
          done(null, user);
        }
        else {
          done(null, false);
        }
      });
    }
  }
};