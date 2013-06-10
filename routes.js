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
    if (req.user.role === 'moderator') {
      return true;
    }
  });

  //admin users can access all pages
  roles.use(function(req) {
    if (req.user.role === 'admin') {
      return true;
    }
  });

  roles.use('access private page', function(req) {
    logger.info('authentication test: ' + req.isAuthenticated);
    if (req.user.isAuthenticated) {
      return true;
    } else false;
  });

  app.get('/', function(req, res) {
    res.render('index', {title: TITLE});
  });

  app.get('/peopletable', roles.can('access private page'),
    function(req, res) {
      res.render('peopletable', {title: TITLE});
    }
  );

  app.get('/register', function(req, res) {
    res.render('register', { });
  });

  app.post('/register', function(req, res) {
    logger.info('create u: ' + req.body.username +
      ' p: ' + req.body.password);
    User.register(new User({username: req.body.username }),
      req.body.password, function(err, account) {
        if (err) {
          return res.render('register', {account: account});
        }

        res.redirect('/');
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

  app.post('/api/query', roles.can('access private page'), api.query);
  app.get('/api/query', roles.can('access private page'), api.query);

  app.get('/api/siyuan', function(req, res) {
      res.send('API working');}
  );

  /* DELETE and PUT is not supported by all browser, we
   currently only use GET */

  app.get('/api/siyuan/post',
    roles.can('access private page'), api.siyuan.post);
  app.get('/api/siyuan/get/:theid',
    roles.can('access private page'), api.siyuan.get);
  app.get('/api/siyuan/put/:theid',
    roles.can('access private page'), api.siyuan.put);
  app.get('/api/siyuan/delete/:theid',
    roles.can('access private page'), api.siyuan.delete);

};
