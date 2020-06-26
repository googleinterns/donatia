const expect  = require('chai').expect;
const request = require('request');
const app = require('../app');

it('Landing page content', function(done) {
    request('http://localhost:3000' , function(error, response, body) {
        expect(body).to.contain("Google STEP App");
        done();
    });
});

it('Landing page status', function(done) {
    request('http://localhost:3000' , function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
    });
});
