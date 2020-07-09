var data = require('../testingOrganizations.json');

exports.view = function(req, res) {
  res.render('discover', { 
    MAPS_KEY: process.env.MAPS_KEY
  });
};

exports.getOrganizations = function(req, res) {
  const startIndex = req.body.start;
  const batchSize = req.body.batchSize;
  const filter = req.body.filter;

  let queried;

  if (filter === 'all') {
    queried = data.organizations;
  } else {
    queried = data.organizations.filter((organization)  =>
      organization.categories.includes(filter));
  }

  let batch = queried.slice(startIndex, startIndex + batchSize);
  res.send(batch);
};
