/**
 * Created with JetBrains WebStorm.
 * User: zzn
 * Date: 6/9/13
 * Time: 9:12 PM
 * To change this template use File | Settings | File Templates.
 */
var passport = require('passport');
var User = require('./models/user');
var api = require('./api');
var roles = require('connect-roles');
var TITLE = 'Siyuan Ren';
var logger = require('log4js').getDefaultLogger();
/**
 * Exposes routes of this application.
 *
 * @param {Object} app Express app passed from app.js.
 */
module.exports = function(app) {

  roles.setFailureHandler(function(req, res, action) {
    logger.warn('error, try to redirect! req=' +
      JSON.stringify(req.isAuthenticated));
    var accept = req.headers.accept || '';
    res.status(403);
    res.redirect('/login');
  });

  roles.use(function(req, action) {
    if (!req.user.isAuthenticated) return action === 'access home page';
  });

  //moderator users can access private page, but
  //they might not be the only one so we don't return
  //false if the user isn't a moderator
  roles.use('access private page', function(req) {
    return true;
    User.find({username: req.user.username}, function(err) {
      if (!err) {
        logger.info('Accessing private page: req.isAuthenticated()=' +
          JSON.stringify(req.isAuthenticated()));
        logger.info('enabled' + req.user.enabled);
        // TODO(zzn): migrate to use promises.
//        if (req.user !== undefined &&
//          req.isAuthenticated() &&
//          req.user.enabled) {
//          return true;
//        }
        return true;
      }
    });
    logger.warn('failed to allow');
    return false;
  });

  //admin users can access all pages
  roles.use(function(req) {
    if (req.user.role === 'admin') {
      return true;
    }
    return false;
  });

  // TODO(zzn) set robots.txt accordingly, for
  // now just disable all.
  app.get('/robots.txt', function(req, res) {
    res.send('User-agent: *\nDisallow: /');
  });

  app.get('/', function(req, res) {
    res.render('index', {title: TITLE});
  });

  app.get('/peopletable',
    function(req, res) {
      res.render('peopletable', {title: TITLE});
    }
  );

  app.get('/register', function(req, res) {
    res.render('register', { });
  });

  app.get('/register/verify', function(req, res) {
    logger.info('Registration verification:' + JSON.stringify(req.query));
    User.find({username: req.query.username}, function(err, user) {
      if (err) {
        res.send('Sorry, the verification URL is invalid');
      } else {
        user.enabled = true;
        res.send('Congratulations, your account is now enabled');

      }
    });
    res.send('Thank you, you have successfully verified');
  });

  app.get('/register/', function(req, res) {
    res.render('register', { });
  });

  app.post('/register', function(req, res) {
    logger.info('create u: ' + req.body.username +
      ' p: ' + req.body.password);
    User.register(new User({username: req.body.username }),
      req.body.password, function(err, user) {
        if (err) {
          logger.warn('Register failure: ' + JSON.stringify(err));
          //res.statusCode(400);
          return res.render('register');
          // TODO(zzn): change to registration failure
        } else {
          user.email = req.body.email;
          user.resetVerificationRandomToken();
          user.save(function(err) {
            MailService = require('./services/mailservice').MailService;
            var mail = {
              text: 'Congratulatons! You have registered at ' +
                process.env.PROJECT_DOMAIN + '\n' +
                'Here is the confirmation link: ' +
                'http://' + process.env.PROJECT_HOSTNAME +
                '.' + process.env.PROJECT_DOMAIN +
                '/register/verify?' +
                'username=' + user.username +
                '&verify=' + user.verificationRandomToken,
              from: 'admin@' + process.env.PROJECT_DOMAIN,
              to: user.email,
              subject: '[Verification] of membership at ' +
                process.env.PROJECT_DOMAIN};
            MailService.send(mail, function(err) {
              logger.info('Sent to: ' + JSON.stringify(mail));
              logger.info('Err: ' + JSON.stringify(err));
              res.redirect('/');
            });
          });

        }
      });
  });

  app.get('/login', function(req, res) {
    res.render('login', {user: req.user});
  });

  app.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
  });

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  app.post('/api/query', api.query);
  app.get('/api/query', api.query);

  app.get('/api/siyuan', function(req, res) {
      res.send('API working');}
  );

  /* DELETE and PUT is not supported by all browser, we
   currently only use GET */

  app.get('/api/siyuan/post', api.siyuan.post);
  app.get('/api/siyuan/get/:theid', api.siyuan.get);
  app.get('/api/siyuan/put/:theid', api.siyuan.put);
  app.get('/api/siyuan/delete/:theid', api.siyuan.delete);

};
