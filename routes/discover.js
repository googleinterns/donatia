var data = require('../testingOrganizations.json');

exports.view = function(req, res) {
  res.render('discover', { 
    MAPS_KEY: process.env.MAPS_KEY
  });
};

exports.getOrganizations = function(req, res) {
  let startIndex = req.body.start;
  let batchSize = req.body.batchSize;
  let batch = data.organizations.slice(startIndex, startIndex + batchSize);
  res.send(batch)
};
