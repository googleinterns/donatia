const database = require('./data');

exports.view = async function (req, res) {
  const categories = await database.getCategories();
  const parsedCategories = parseCategories(categories);

  res.render('discover', {
    MAPS_KEY: process.env.MAPS_KEY,
    user: req.user,
    categories: parsedCategories,
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

/**
 * Parses the categories into a human-readable format for the discover page.
 * @param {array} categories The categories as saved in the database.
 * @return {array} The categories parsed into a human-readable format.
 */
function parseCategories(categories) {
  const parsed = {};
  for (let category of categories) {
    // Replaces special characters with spaces.
    let parsedCategory = category.replace(/[^a-zA-Z0-9]/g, ' ');

    // parsed[category] = parsedCategory;
    parsed[parsedCategory] = category;
  }
  return parsed;
}
