/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express-handlebars');
var bodyParser = require('body-parser');

var app = express();

// Environments configs. 
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.use(express.urlencoded());
app.use('/static', express.static('public'));
app.use(bodyParser.json())

// Load API keys.
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// Routes.
app.get('/', (req, res) => res.render('index'));

const discover = require('./routes/discover')
app.get('/discover', discover.view);
app.post('/discover', discover.getOrganizations);

const dashboard = require('./routes/dashboard');
app.get('/dashboard/:id/:page?', dashboard.view);

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
  app.emit("app_started");
});

// Exporting for running unit tests.
module.exports = app;
