
/**
 * External dependencies.
 */

var http = require('http');
var path = require('path');
var express = require('express');
var mongoose = require('mongoose');

var logger = require('log4js').getLogger();


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

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

app.configure('development', function() {
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/peopletable', routes.peopletable);
app.get('/login', routes.login);
app.get('/logout', routes.logout);
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
