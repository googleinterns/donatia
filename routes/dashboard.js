/*
 * GET client-side rendering dashboard page.
 */

exports.view = function (req, res) {
  const pageParam = req.params.page;
  var pageName = 'dashboardProfile';
  if (pageParam === 'categories') pageName = 'dashboardCategories';

  var orgName = "Organization";

  // Simulation of database retrieving known user's information.
  if (req.user.id === '101861107470846011638') orgName = "Google";

  res.render(
    pageName,
    {
      layout: 'dashboard',
      id: orgName,
      editable: pageParam === 'edit',
    }
  )
}
