'use strict';

var express = require('express');
var app = require('express.io')();
var passport = require('passport');
var path = require('path');
var mongoose = require('mongoose');
var User = require('./server/models/User.js');
var auth = require('./server/controllers/auth.js');
var constants = require('./shared/constants');
var logger = require('./server/services/loggerservice.js').default;//require('./server/services/loggerservice.js');

var Q = require('q');

app.http().io();

app.set('views', __dirname + '/client/views');
app.set('view engine', 'jade');
app.set('port', process.env.PORT || 5000);
app.set('mongooseUrl', process.env.MONGOHQ_DEV_URL || process.env.MONGOHQ_DEV_URL);

app.use(express.logger('dev'))
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'client')));
app.use(express.session({ key: 'express.sid', secret: 'keyboard cat'}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(auth.localStrategy);
for(var i in constants.ENABED_PROVIDERS) {
  var provider = constants.ENABED_PROVIDERS[i];
  passport.use(auth.getStrategy(provider));
}
passport.use(auth.googleStrategy());

passport.serializeUser(auth.serializeUser);
passport.deserializeUser(auth.deserializeUser);

// Connect to MongoDB



Q.fcall(function() {
    var d = Q.defer();
    var options = { server: { socketOptions: { connectTimeoutMS: 5000 }}};
    mongoose.connect(app.get('mongooseUrl'), options, function(err) {
      if(err){
        d.reject(new Error(err));
      } else {
        d.resolve();
      }
    });
    return d.promise;
})
.then(function(){
  logger.info('Connected to database');
  // Set up routes
  require('./server/routes.js')(app);
})
.then(function() {
  var d = Q.defer();
  app.listen(app.get('port'), function(err){
    if(err) {
      d.reject(new Error(err));
    }
    d.resolve();
  });
})
.then(function() {
  logger.info('Start listening on ' + app.get('port'));
}, function(err) {
  logger.error(err);
}).done();


