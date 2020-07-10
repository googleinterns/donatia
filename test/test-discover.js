const expect  = require('chai').expect;
const request = require('request');
const app = require('../app');

it('Discover page content', function(done) {
  request(process.env.BASE_URL + 'discover' , function(error, response, body) {
      expect(body).to.contain("Google STEP App");
      expect(body).to.contain("All"); // check for search drop down
      done();
  });
});

it('Discover page status', function(done) {
  request(process.env.BASE_URL + 'discover' , function(error, response, body) {
      expect(response.statusCode).to.equal(200);
      done();
  });
});
