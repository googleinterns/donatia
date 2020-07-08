/*
 * GET client-side rendering dashboard page.
 */

exports.view = function (req, res) {
  const pageParam = req.params.page;
  let pageName = "dashboardProfile";
  if (pageParam === "categories") pageName = "dashboardCategories";

  res.render(pageName, {
    layout: "dashboard",
    id: req.params.id,
    editable: pageParam === "edit",
  });
};
