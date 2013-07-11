var _ =           require('underscore')
    , path =      require('path')
    , passport =  require('passport')
    , AuthCtrl =  require('./controllers/auth')
    , UserCtrl =  require('./controllers/user')
    , ApiCtrl = require('./controllers/api')
    , userRoles = require('../client/js/routingConfig').userRoles
    , accessLevels = require('../client/js/routingConfig').accessLevels
    , constants = require('../shared/constants')
    , logger = require(process.env.ROOT_DIR + '/server/services/loggerservice').default;
    ;
var otherUsers = {};

var getProviderRoutes = function(providers){
  var pRoutes = [];
  for (var i in providers) {
    var provider =  providers[i];
    pRoutes = pRoutes.concat([{
      path: '/auth/' + provider,
      httpMethod: 'GET',
      middleware: [passport.authenticate(provider)],
      accessLevel: accessLevels.public
    }, {
      path: '/auth/' + provider +'/callback',
      httpMethod: 'GET',
      middleware: [passport.authenticate(provider, {
        successRedirect: '/register',
        failureRedirect: '/login'
      })],
      accessLevel: accessLevels.public
    }]);
  }
  return pRoutes;
};


routes = []
  .concat(
    // Views
    {
      path: '/partials/*',
      httpMethod: 'GET',
      middleware: [function (req, res) {
        var requestedView = path.join('./', req.url);
        res.render(requestedView);
      }],
      accessLevel: accessLevels.public
    })
  .concat(getProviderRoutes(constants.ENABED_PROVIDERS))
  .concat([



    {
        path: '/auth/google',
        httpMethod: 'GET',
        middleware: [passport.authenticate('google')],
        accessLevel: accessLevels.public
    },
    {
        path: '/auth/google/return',
        httpMethod: 'GET',
        middleware: [passport.authenticate('google', {
            successRedirect: '/',
            failureRedirect: '/login'
        })],
        accessLevel: accessLevels.public
    },

    // Local Auth
    {
        path: '/register',
        httpMethod: 'POST',
        middleware: [AuthCtrl.register],
        accessLevel: accessLevels.public
    },
    {
        path: '/login',
        httpMethod: 'POST',
        middleware: [AuthCtrl.login],
        accessLevel: accessLevels.public
    },
    {
        path: '/logout',
        httpMethod: 'POST',
        middleware: [AuthCtrl.logout],
        accessLevel: accessLevels.public
    },
    // User resource
    {
        path: '/users',
        httpMethod: 'GET',
        middleware: [ensureAuthenticated, ensureAuthorized, UserCtrl.index],
        accessLevel: accessLevels.admin
    },
    // API resource
    {
      path: '/api/siyuan/get/:theid',
      httpMethod: 'GET',
      middleware: [ensureAuthenticated, ensureAuthorized, ApiCtrl.get],
      accessLevel: accessLevels.admin
    },
    {
      path: '/api/siyuan/put/:theid',
      httpMethod: 'GET',
      middleware: [ensureAuthenticated, ensureAuthorized, ApiCtrl.put],
      accessLevel: accessLevels.admin
    },
    {
      path: '/api/siyuan/delete/:theid',
      httpMethod: 'GET',
      middleware: [ensureAuthenticated, ensureAuthorized, ApiCtrl.delete],
      accessLevel: accessLevels.admin
    },
    {
      path: '/api/siyuan/post',
      httpMethod: 'GET',
      middleware: [ensureAuthenticated, ensureAuthorized, ApiCtrl.post],
      accessLevel: accessLevels.admin
    },
    {
      path: '/api',
      httpMethod: 'GET',
      middleware: [ensureAuthenticated, ensureAuthorized, ApiCtrl.index],
      accessLevel: accessLevels.admin
    },
    {
      path: '/api/query',
      httpMethod: 'GET',
      middleware: [ensureAuthenticated, ensureAuthorized, ApiCtrl.query],
      accessLevel: accessLevels.user
    },
    {
      path: '/api/publicquery',
      httpMethod: 'GET',
      middleware: [ApiCtrl.publicquery],
      accessLevel: accessLevels.public
    },
    {
      path: '/api/onboard',
      httpMethod: 'GET',
      middleware: [ApiCtrl.onboard.get],
      accessLevel: accessLevels.public
    },
    {
      path: '/api/onboard',
      httpMethod: 'POST',
      middleware: [ApiCtrl.onboard.post],
      accessLevel: accessLevels.public
    },
    {
      path: '/api/changeHistory',
      httpMethod: 'GET',
      middleware: [ApiCtrl.changeHistory],
      accessLevel: accessLevels.user
    },
    {
      path: '/api/emailreset',
      httpMethod: 'POST',
      middleware: [ensureAuthenticated, ensureAuthorized, ApiCtrl.emailReset],
      accessLevel: accessLevels.admin
    },

    // All other get requests should be handled by AngularJS's client-side routing system
    {
        path: '/*',
        httpMethod: 'GET',
        middleware: [function(req, res) {
            var role = userRoles.public, username = '', meta, siyuanUserProfile = {};
            if(req.user) {
                role = req.user.role;
                username = req.user.username;
                meta = req.user.meta;
                siyuanUserProfile['本科院系'] = req.user.siyuanUserProfile['本科院系'];
                siyuanUserProfile['思源学员期数'] = req.user.siyuanUserProfile['思源学院期数'];
            }
            var cookieUser = JSON.stringify({
              'username': username,
              'role': role,
              'meta': meta,
              'siyuanUserProfile' : siyuanUserProfile
            });
            logger.debug('cookieUser: ' + cookieUser);
            res.cookie('user', cookieUser);
            res.render('index');
        }],
        accessLevel: accessLevels.public
    },

    // socket routes
    {
      path: 'connection',
      ioRoute: true,
      middleware: [function(req) {
        logger.debug('on connection');
        // req.io.emit('edit', {en:'a'});
      }],
      accessLevel: accessLevels.public
    },
    {
      path: 'enter',
      ioRoute: true,
      middleware: [function(req) {
        try{
          var enterUser = req.handshake.session.passport.user;
          otherUsers[enterUser] = enterUser;
          logger.debug('Enter: ' + enterUser);
          req.io.emit('enter', { otherUsers: otherUsers });
          req.io.broadcast('someoneEnter', {enterUser: enterUser});
        } catch(Exception) {
          logger.warn('Someone enter, but we can\'t retrieve usernmae.');
        }
      }],
      accessLevel: accessLevels.admin
    },
    {
      path: 'disconnect',
      ioRoute: true,
      middleware: [function(req) {
          try{
            var leaveUser = req.handshake.session.passport.user;
            logger.debug('Leave: ' + leaveUser);
            delete otherUsers[leaveUser];
            req.io.broadcast('leave', { leaveUser: leaveUser });
          } catch(Exception){
            logger.warn('Someone leave, but we can\'t retrieve usernmae.');
          }
      }],
      accessLevel: accessLevels.public
    },

]);

module.exports = function(app) {

    _.each(routes, function(route) {

        var args = _.flatten([route.path, route.middleware]);

        if (route.ioRoute){
          app.io.route.apply(app.io, args);
        } else {
          switch(route.httpMethod.toUpperCase()) {
              case 'GET':
                  app.get.apply(app, args);
                  break;
              case 'POST':
                  app.post.apply(app, args);
                  break;
              case 'PUT':
                  app.put.apply(app, args);
                  break;
              case 'DELETE':
                  app.delete.apply(app, args);
                  break;
              default:
                  throw new Error('Invalid HTTP method specified for route ' + route.path);
                  break;
          }
        }
    });



}

function ensureAuthenticated(req, res, next) {
    if(req.isAuthenticated()) return next();
    else                      return res.send(401);
}

function ensureAuthorized(req, res, next) {
    if(!req.user) return res.send(401);

    var accessLevel = _.findWhere(routes, { path: req.route.path }).accessLevel || accessLevels.public;
    if(!(accessLevel & req.user.role)) return res.send(403);

    return next();
}