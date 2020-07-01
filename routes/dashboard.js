/*
 * GET client-side rendering dashboard page.
 */

exports.view = function (req, res) {
  const pageParam = req.params.page;
  var pageName = 'dashboardProfile';

  res.render(
    pageName,
    {
      layout: 'dashboard',
      id: req.params.id,
      editable: pageParam === 'edit',
    }
  )
}
