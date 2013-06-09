
/**
 * External dependencies.
 */

var http = require('http');
var path = require('path');
var express = require('express');
var mongoose = require('mongoose');

var logger = require('log4js').getLogger();
var User = require('./models/user');

LocalStrategy = require('passport-local').Strategy;
/**
 * Constants
 */
var USERNAME = 'testuser';
var PASSWORD = 'testpass';
var MONGO_HOST = 'alex.mongohq.com';
var MONGO_PORT = '10077';
var MONGO_DBNAME = 'app14616351';
var MONGO_LOCAL_URL = 'mongodb://' +
  USERNAME + ':' + PASSWORD +
  '@' + MONGO_HOST + ':' + MONGO_PORT + '/' + MONGO_DBNAME;
var passport = require('passport');

/**
 * Mongooses set up
 */
var mongoUri = process.env.MONGOHQ_URL || MONGO_LOCAL_URL;
mongoose.connect(mongoUri);

/**
 * Internal dependencies
 */

var routes = require('./routes');
var api = require('./api');
var user = require('./routes/user');
var app = express();
app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function() {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function() {
  app.use(express.errorHandler());
});

// Configure passport

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/', routes.index);
app.get('/peopletable', routes.peopletable);

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

app.get('/profile', routes.profile);
app.get('/users', user.list);

app.post('/api/query', api.query);
app.get('/api/query', api.query);
app.get('/api/peopletable', api.peopletable);

app.get('/api/siyuan', function(req, res) {
  res.send('API working');}
);

// DELETE and PUT is not supported by all browser
app.get('/api/siyuan/post', api.siyuan.post);
app.get('/api/siyuan/get/:theid', api.siyuan.get);
app.get('/api/siyuan/put/:theid', api.siyuan.put);
app.get('/api/siyuan/delete/:theid', api.siyuan.delete);

http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
