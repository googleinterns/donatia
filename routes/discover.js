var data = require('../testingOrganizations.json');

exports.view = function(req, res) {
  res.render('discover', { 
    MAPS_KEY: process.env.MAPS_KEY
  });
};

exports.getOrganizations = function(req, res) {
  let filter = req.params.filter

  if (filter === 'all') {
    res.send(data.organizations)
  } else {
    let filtered = data.organizations.filter(function (organization) {
      return organization.categories.includes(filter);
    });
    res.send(filtered);
  }
};
