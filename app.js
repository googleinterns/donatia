const PROD_WARNING_MESSAGE = `
██     ██  █████  ██████  ███    ██ ██ ███    ██  ██████      ██ 
██     ██ ██   ██ ██   ██ ████   ██ ██ ████   ██ ██           ██ 
██  █  ██ ███████ ██████  ██ ██  ██ ██ ██ ██  ██ ██   ███     ██ 
██ ███ ██ ██   ██ ██   ██ ██  ██ ██ ██ ██  ██ ██ ██    ██        
 ███ ███  ██   ██ ██   ██ ██   ████ ██ ██   ████  ██████      ██ 


You are running the app using production config (Firestore Database, Map API keys, etc).

If you are developing the app locally, please use "npm run dev" to start the app.
`;

// Load API keys.
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
} else {
  console.log(PROD_WARNING_MESSAGE);
}

// Module dependencies.
var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express-handlebars')
var passport = require('passport');
var cookieSession = require('cookie-session');
require('./passport-auth');

var app = express();

// Environments configs. 
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.use(express.urlencoded());
app.use('/static', express.static('public'));
app.use(cookieSession({
  name: 'auth-session',
  keys: ['key1', 'key2']
}));
app.use(passport.initialize());
app.use(passport.session());

// Authentication middleware
const isLoggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
  }
}

// Routes.
app.get('/', (req, res) => res.render('index'));

const discover = require('./routes/discover')
app.get('/discover', discover.view);
app.post('/discover', discover.getOrganizations);

const dashboard = require('./routes/dashboard');
app.get('/dashboard/:page?', isLoggedIn, dashboard.view);

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  function (req, res) {
    res.redirect('/dashboard');
  });

app.get('/auth/logout', (req, res) => {
  req.session = null;
  req.logout();
  res.redirect('/');
});

const data = require('./routes/data');
app.get('/data', data.view);

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
  app.emit("app_started");
});

// Exporting for running unit tests.
module.exports = app;
