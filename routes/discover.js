var data = require('../testingOrganizations.json');

exports.mapsKey = function(req, res) {
  res.render('discover', { 
    MAPS_KEY: process.env.MAPS_KEY
  });
};

exports.getOrganizations = function(req, res) {
  res.send(data.organizations)
};
