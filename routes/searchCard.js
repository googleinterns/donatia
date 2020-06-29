var data = require('../testOrganizations.json');

exports.test = function(req, res) {
  res.render('discover', { organizations: data.organizations });
};
