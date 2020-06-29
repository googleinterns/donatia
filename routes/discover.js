var data = require('../testingOrganizations.json');

exports.test = function(req, res) {
  res.render('discover', { organizations: data.organizations });
};
