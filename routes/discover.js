var data = require('../testingOrganizations.json');

exports.view = function(req, res) {
  res.render('discover', { organizations: data.organizations });
};
