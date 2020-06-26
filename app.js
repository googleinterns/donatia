/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express-handlebars')

var app = express();

// Environments configs. 
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.use(express.urlencoded());
app.use('/static', express.static('public'));

app.get('/', (req, res) => res.render('index'));

app.get('/dashboard/:id/:page?', function(req, res) {
  var showEditPage = req.params.page === 'edit';
  res.render(
    'dashboard',
    { 
      id: req.params.id,
      editable: showEditPage
    }
  )
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
