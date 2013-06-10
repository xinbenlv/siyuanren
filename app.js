
/**
 * External dependencies.
 */

var http = require('http');
var path = require('path');
var express = require('express');
var mongoose = require('mongoose');
var roles = require('connect-roles');
var logger = require('log4js').getLogger();
var User = require('./models/user');
var flash = require('connect-flash');
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
 * Internal dependencies
 */

var routes = require('./routes');
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

  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(roles);
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function() {
  logger.info('Development Setup');
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

  /**
   * Mongooses set up
   */
  var mongoUri = MONGO_LOCAL_URL;
  mongoose.connect(mongoUri);

  // Test if we have already populated some test data

  var SiyuanUserProfile = require('./models/siyuanuserprofile');
  logger.info('Verify sample data');
  SiyuanUserProfile.find({}, function(err, docs) {
    logger.info('Found:' + JSON.stringify(docs));
    if (docs.length == 0) {
      logger.info('No sample data found! Populate some!');
      SiyuanUserProfile.create(require('./sample').staticData, function() {
        logger.info('Populated static data');
      });
    }
  });
});

app.configure('production', function() {
  var mongoUri = process.env.MONGOHQ_URL;
  mongoose.connect(mongoUri);
  app.use(express.errorHandler());
});

// Configure passport

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

roles.use('access private page', function(req) {
  if (req.isAuthenticated()) {
    return true;
  } else false;
});

// Setup routes
require('./routes')(app);

http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
