const database = require('./data');

exports.view = function (req, res) {
  res.render('discover', {
    MAPS_KEY: process.env.MAPS_KEY,
    user: req.user,
  });
};

exports.getOrganizations = async function (req, res) {
  const filter = req.params.filter.toLowerCase();

  let filtered;

  if (filter === 'all') {
    filtered = await database.getAllOrganizations(filter);
  } else {
    filtered = await database.getFilteredOrganizations(filter);
  }
  res.send(filtered);
};
