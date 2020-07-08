const expect = require("chai").expect;
const request = require("request");
require("../app");

it("Discover page content", function (done) {
  request("http://localhost:3000/discover", function (error, response, body) {
    expect(body).to.contain("Google STEP App");
    expect(body).to.contain("All"); // check for search drop down
    done();
  });
});

it("Discover page status", function (done) {
  request("http://localhost:3000/discover", function (error, response, body) {
    expect(response.statusCode).to.equal(200);
    done();
  });
});
