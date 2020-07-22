/*
 * GET client-side rendering dashboard page.
 */

exports.view = function (req, res) {
  const pageParam = req.params.page;
  let pageName = 'dashboardProfile';
  if (pageParam === 'categories') pageName = 'dashboardCategories';

  res.render(pageName, {
    layout: 'dashboard',
    editable: pageParam === 'edit',
    user: req.user,
    MAPS_KEY: process.env.MAPS_KEY,
  });
};
