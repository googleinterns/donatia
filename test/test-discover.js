const expect = require('chai').expect;
const request = require('request');
require('../app');

it('Discover page status', function (done) {
  request(process.env.BASE_URL + 'discover', function (error, response, body) {
    expect(response.statusCode).to.equal(200);
    done();
  });
});
