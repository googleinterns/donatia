const expect = require('chai').expect;
const request = require('request');
require('../app');

const authUserKey = 'ZqbEncqt9EsJTLOcXRxt';
const authUserID = '7dJFX6hTPwVK9tLkXnrT';
it('Authenticated user found', function (done) {
  request(`${process.env.TEST_DATABASE_URL}data/organization/member/${authUserKey}`, function (
    error,
    response,
    body
  ) {
    expect(response.statusCode).to.equal(200);
    expect(body).to.contain(authUserID);
    done();
  });
});

const authOrgKey = '7dJFX6hTPwVK9tLkXnrT';
it('Organization connection found', function (done) {
  request(`${process.env.TEST_DATABASE_URL}data/member/organization/${authOrgKey}`, function (
    error,
    response,
    body
  ) {
    expect(response.statusCode).to.equal(200);
    expect(body).to.contain('Authenticated Account');
    done();
  });
});

const unAuthUserKey = 'HBfL3v5C19zRTMeMheOC';
it('Unauthenticated user detected', function (done) {
  request(`${process.env.TEST_DATABASE_URL}data/organization/member/${unAuthUserKey}`, function (
    error,
    response,
    body
  ) {
    expect(response.statusCode).to.equal(200);
    expect(body).to.contain('{}');
    done();
  });
});
