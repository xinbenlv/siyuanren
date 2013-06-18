var express =       require('express')
    , app =         require('express.io')()
    , passport =    require('passport')
    , path =        require('path')
    , mongoose =    require('mongoose')
    , User =        require('./server/models/User.js')
    , auth =        require('./server/controllers/auth.js')
    , constants =   require('./shared/constants')
    , logger =      require('log4js').getDefaultLogger()
    ;
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
passport.use(auth.googleStrategy());   // Comment out this line if you don't want to enable login via Google

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect(process.env.MONGOHQ_DEV_URL || process.env.MONGOHQ_DEV_URL);

require('./server/routes.js')(app);

app.set('port', process.env.PORT || 8000);

app.listen(app.get('port'), function(){
  logger.debug('Start listening on ' + app.get('port'));
});
