exports.view = function (req, res) {
  res.render('moreInfo', {
    user: req.user,
    MAPS_KEY: process.env.MAPS_KEY,
  });
};
