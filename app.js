
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var api = require('./api');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

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


http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
