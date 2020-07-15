/* eslint-disable */
const PROD_WARNING_MESSAGE = `
██     ██  █████  ██████  ███    ██ ██ ███    ██  ██████      ██ 
██     ██ ██   ██ ██   ██ ████   ██ ██ ████   ██ ██           ██ 
██  █  ██ ███████ ██████  ██ ██  ██ ██ ██ ██  ██ ██   ███     ██ 
██ ███ ██ ██   ██ ██   ██ ██  ██ ██ ██ ██  ██ ██ ██    ██        
 ███ ███  ██   ██ ██   ██ ██   ████ ██ ██   ████  ██████      ██ 


You are running the app using production config (Firestore Database, Map API keys, etc).

If you are developing the app locally, please use "npm run dev" to start the app.
`;
/* eslint-enable */

// Show production warning message and load API keys.
if (process.env.NODE_ENV === 'production') {
  console.log(PROD_WARNING_MESSAGE);
  require('dotenv').config({path: '.env.prod'});
} else {
  require('dotenv').config({path: '.env.dev'});
}

// Module dependencies.
const express = require('express');
const http = require('http');
const path = require('path');
const handlebars = require('express-handlebars');
const passport = require('passport');
const cookieSession = require('cookie-session');
require('./passport-auth');

const app = express();

// Environments configs.
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.use(express.urlencoded());
app.use(express.json());
app.use('/static', express.static('public'));
app.use(
  cookieSession({
    name: 'auth-session',
    keys: ['key1', 'key2'],
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Authentication middleware
const isLoggedIn = (req, res, next) => {
  req.user ? next() : res.redirect('/auth/google');
};

// Routes.
app.get('/', (req, res) => res.render('landing', {user: req.user}));

const discover = require('./routes/discover');
app.get('/discover', discover.view);
app.get('/discover/:filter', discover.getOrganizations);

const moreInfo = require('./routes/moreInfo');
app.get('/discover/organization/:id', moreInfo.view);

const dashboard = require('./routes/dashboard');
app.get('/dashboard/:page?', isLoggedIn, dashboard.view);

app.get('/auth/google', passport.authenticate('google', {scope: ['profile']}));

app.get(
  '/auth/google/callback',
  passport.authenticate('google', {failureRedirect: '/'}),
  (req, res) => res.redirect('/dashboard')
);

app.get('/auth/logout', (req, res) => {
  req.session = null;
  req.logout();
  res.redirect('/');
});

const data = require('./routes/data');
app.get('/data/acceptedcategories/:id', data.acceptedCategoriesGet);
app.post('/data/acceptedcategories/:id', data.acceptedCategoriesPost);
app.delete('/data/acceptedcategories/:id', data.acceptedCategoriesDelete);
app.get(
  '/data/acceptedcategories/:field(organization|category)/:id',
  data.acceptedCategoriesByFieldGet
);
app.post('/data/acceptedcategories/organization/:id', data.acceptedCategoriesOrganizationPost);
app.get('/data/categories', data.categoriesGet);

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
  app.emit('app_started');
});

// Exporting for running unit tests.
module.exports = app;
