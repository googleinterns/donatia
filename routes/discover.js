const data = require('../testingOrganizations.json');
const database = require('./data')

exports.view = function (req, res) {
  res.render('discover', {
    MAPS_KEY: process.env.MAPS_KEY,
    user: req.user,
  });
};

exports.getOrganizations = async function (req, res) {
  const filter = req.params.filter.toLowerCase();

  if (filter === 'all') {
    res.send(data.organizations);
  } else {
    const filtered = await database.getFilteredOrganizations(filter);
    res.send(filtered);
  }
};
