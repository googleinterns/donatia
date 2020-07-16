const expect = require('chai').expect;
const request = require('request');
require('../app');

it('Landing page content', function (done) {
  request(process.env.BASE_URL, function (error, response, body) {
    expect(body).to.contain('Find the best organizations to donate your items to');
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
    expect(response.statusCode).to.equal(200);
    done();
  });
});

it('Dashboard view page', function (done) {
  request(process.env.BASE_URL + 'dashboard', function (error, response, body) {
    expect(response.statusCode).to.equal(200);
    done();
  });
});

it('Dashboard edit page', function (done) {
  request(process.env.BASE_URL + 'dashboard/edit', function (error, response, body) {
    expect(response.statusCode).to.equal(200);
    done();
  });
});
