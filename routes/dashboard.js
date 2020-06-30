/*
 * GET client-side rendering dashboard page.
 */

exports.view = function(req, res) {
  var pageParam = req.params.page;
  var pageName = 'dashboardView';
  if (pageParam === 'edit') pageName = 'dashboardEdit';
  if (pageParam === 'categories') pageName = 'dashboardCategories';

  res.render(
    pageName,
    {
      layout: 'dashboard',
      id: req.params.id,
    }
  )
}
