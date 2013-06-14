var express =       require('express')
    , http =        require('http')
    , passport =    require('passport')
    , path =        require('path')
    , mongoose =    require('mongoose')
    , User =        require('./server/models/User.js')
    , auth =        require('./server/controllers/auth.js')
var app = express();

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
passport.use(auth.twitterStrategy());  // Comment out this line if you don't want to enable login via Twitter
passport.use(auth.facebookStrategy()); // Comment out this line if you don't want to enable login via Facebook
passport.use(auth.googleStrategy());   // Comment out this line if you don't want to enable login via Google
passport.use(auth.linkedInStrategy()); // Comment out this line if you don't want to enable login via LinkedIn

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect(process.env.MONGOHQ_DEV_URL || process.env.MONGOHQ_DEV_URL);

require('./server/routes.js')(app);

app.set('port', process.env.PORT || 8000);
http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});