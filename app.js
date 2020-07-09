/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express-handlebars')

var app = express();
const PROD_WARNING_MESSAGE = `
██     ██  █████  ██████  ███    ██ ██ ███    ██  ██████      ██ 
██     ██ ██   ██ ██   ██ ████   ██ ██ ████   ██ ██           ██ 
██  █  ██ ███████ ██████  ██ ██  ██ ██ ██ ██  ██ ██   ███     ██ 
██ ███ ██ ██   ██ ██   ██ ██  ██ ██ ██ ██  ██ ██ ██    ██        
 ███ ███  ██   ██ ██   ██ ██   ████ ██ ██   ████  ██████      ██ 


You are running the app using production config (Firestore Database, Map API keys, etc).

If you are developing the app locally, please use "npm run dev" to start the app.
`;
// Environments configs. 
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.use(express.urlencoded());
app.use(express.json());
app.use('/static', express.static('public'));

// Load API keys.
require('dotenv').config();

// Show production warning message.
if (process.env.NODE_ENV === 'production') {
  console.log(PROD_WARNING_MESSAGE);
}

// Routes.
app.get('/', (req, res) => res.render('index'));

const discover = require('./routes/discover')
app.get('/discover', discover.view);
app.post('/discover', discover.getOrganizations);

const dashboard = require('./routes/dashboard');
app.get('/dashboard/:id/:page?', dashboard.view);

const data = require('./routes/data');
app.get('/data/acceptedcategories/:id', data.acceptedCategoriesGet);
app.delete('/data/acceptedcategories/:id', data.acceptedCategoriesDelete)
app.get('/data/acceptedcategories/:field(organization|category)/:id', data.acceptedCategoriesByFieldGet);
app.post('/data/acceptedcategories/organization/:id', data.acceptedCategoriesOrganizationPost);
app.get('/data/categories', data.categoriesGet);


http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
  app.emit("app_started");
});

// Exporting for running unit tests.
module.exports = app;
