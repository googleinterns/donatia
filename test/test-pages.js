const expect = require('chai').expect;
const request = require('request');
const app = require('../app');

it('Landing page content', function (done) {
  request(process.env.BASE_URL, function (error, response, body) {
    expect(body).to.contain("Google STEP App");
    done();
  });
});

it('Landing page status', function (done) {
  request(process.env.BASE_URL, function (error, response, body) {
    expect(response.statusCode).to.equal(200);
    done();
  });
});

it('Dashboard categories page', function (done) {
  request(process.env.BASE_URL + 'dashboard/categories', function (error, response, body) {
    expect(response.statusCode).to.equal(401);
    done();
  });
});

it('Dashboard view page', function (done) {
  request(process.env.BASE_URL + 'dashboard', function (error, response, body) {
    expect(response.statusCode).to.equal(401);
    done();
  });
});

it('Dashboard edit page', function (done) {
  request(process.env.BASE_URL + 'dashboard/edit', function (error, response, body) {
    expect(response.statusCode).to.equal(401);
    done();
  });
});
