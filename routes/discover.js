var data = require('../testingOrganizations.json');

exports.view = function(req, res) {
  res.render('discover', { 
    organizations: data.organizations,
    MAPS_KEY: process.env.MAPS_KEY
  });
};
