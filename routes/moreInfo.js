exports.view = function (req, res) {
  res.render('moreInfo', {
    user: req.user,
  });
};
