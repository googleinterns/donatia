/*
 * GET home page.
 */

exports.view = function(req, res){
    res.render('index', {
        auth: true,
        firstName: req.params.firstName,
        lastName: req.params.lastName,
        podMembers: [
            "sabrina",
            "malcolm",
            "dan",
            "chen",
            "bruce"
        ]
    });
};
