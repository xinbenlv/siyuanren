'use strict';

var express = require('express');
var app = require('express.io')();
var passport = require('passport');
var path = require('path');
var mongoose = require('mongoose');
var User = require('./server/models/User.js');
var auth = require('./server/controllers/auth.js');
var constants = require('./shared/constants');
var logger = require('log4js').getDefaultLogger();

app.http().io();

app.set('views', __dirname + '/client/views');
app.set('view engine', 'jade');
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
mongoose.connect(process.env.MONGOHQ_DEV_URL || process.env.MONGOHQ_DEV_URL);

// Set up routes
require('./server/routes.js')(app);

app.set('port', process.env.PORT || 5000);

app.listen(app.get('port'), function(){
  logger.debug('Start listening on ' + app.get('port'));
});
