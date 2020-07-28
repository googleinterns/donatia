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

  const filtered =
    filter === 'all'
      ? await database.getAllOrganizations(req.user)
      : await database.getFilteredOrganizations(filter, req.user);

  res.json({
    isLoggedIn: req.user !== undefined,
    organizations: filtered,
  });
};

/**
 * Parses the categories into a human-readable format for the discover page.
 * @param {array} categories The categories as saved in the database.
 * @return {JSON} An object matching parsed category named to unparsed category names.
 */
function parseCategories(categories) {
  const parsed = {};
  for (const category of categories) {
    // Replaces special characters with spaces.
    const parsedCategory = category.replace(/[^a-zA-Z0-9]/g, ' ');
    parsed[parsedCategory] = category;
  }
  return parsed;
}
