const expect = require("chai").expect;
const request = require("request");
require("../app");

it("Landing page content", function (done) {
  request("http://localhost:3000", function (error, response, body) {
    expect(body).to.contain("Google STEP App");
    done();
  });
});

it("Landing page status", function (done) {
  request("http://localhost:3000", function (error, response, body) {
    expect(response.statusCode).to.equal(200);
    done();
  });
});

it("Dashboard categories page", function (done) {
  request("http://localhost:3000/dashboard/testorg/categories", function (error, response, body) {
    expect(response.statusCode).to.equal(200);
    expect(body).to.contain("testorg's Dashboard");
    expect(body).to.contain("Add a category");
    done();
  });
});

it("Dashboard view page", function (done) {
  request("http://localhost:3000/dashboard/testorg", function (error, response, body) {
    expect(response.statusCode).to.equal(200);
    expect(body).to.contain("testorg's Dashboard");
    expect(body).to.contain('<input disabled type="text"');
    done();
  });
});

it("Dashboard edit page", function (done) {
  request("http://localhost:3000/dashboard/organization/edit", function (error, response, body) {
    expect(response.statusCode).to.equal(200);
    expect(body).to.contain("organization's Dashboard");
    done();
  });
});
