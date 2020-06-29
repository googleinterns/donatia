exports.test = function(req, res) {
  res.render('index', {
    title: "XYZ Homeless Shelter",
    address: "12345 Road Drive",
    phone: "(123) 456-7890",
    categories: ["clothing", "cleaning products", "food", "furniture"],
    isSupportDropOff: false,
    isSupportMailIn: true
  });
};
