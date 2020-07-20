const expect = require('chai').expect;
const request = require('request');
const data = require('../routes/data');
const mockData = require('./mock-data');

before(function () {
  // Initialize mock Firestore database
  mockData.populateMockDatabase();
  data.setDatabase(mockData.firestoreMock);
});

it('GET Request /data/categories : Get all categories', function (done) {
  request(process.env.BASE_URL + 'data/categories', function (error, response, body) {
    expect(response.statusCode).to.equal(200);
    const expectedBody = Object.keys(mockData.MOCK_CATEGORIES);
    expect(JSON.parse(body)).to.deep.equal(expectedBody);
    done();
  });
});

it('GET Request /data/acceptedcategories/:id : get an AcceptedCategory', function (done) {
  request(
    process.env.BASE_URL + `data/acceptedcategories/${mockData.ACC_CTG_ID_WOMEN_SHELTER_FOR_HYGIENE}`,
    function (error, response, body) {
      expect(response.statusCode).to.equal(200);
      expect(JSON.parse(response.body)).to.deep.equal(mockData.MOCK_ACCEPTED_CATEGORIES[mockData.ACC_CTG_ID_WOMEN_SHELTER_FOR_HYGIENE]);
      done();
    }
  );
});

it('POST Request /data/acceptedcategories/:id : update qualityGuidelines field', function (done) {
  const updatedGuidelines = {qualityGuidelines: ['gently used', 'no damage']}; 
  request.post(
    {
      headers: {'content-type': 'application/json'},
      url:
        process.env.BASE_URL +
        `data/acceptedcategories/${mockData.ACC_CTG_ID_FURNITURE_BANK_FOR_FURNITURE}`,
      body: JSON.stringify(updatedGuidelines),
    },
    function (error, response, body) {
      expect(response.statusCode).to.equal(201);
      expect(
        mockData.firestoreMock
          .collection('dev-AcceptedCategories')
          .doc(`${mockData.ACC_CTG_ID_FURNITURE_BANK_FOR_FURNITURE}`)
          .get()
          .data().qualityGuidelines
      ).to.deep.equal(updatedGuidelines.qualityGuidelines);
      done();
    }
  );
});

it('DELETE Request /data/acceptedcategories/:id : delete an AcceptedCategory', function (done) {
  request.delete(
    process.env.BASE_URL + `data/acceptedcategories/${mockData.ACC_CTG_ID_HOMELESS_SHELTER_FOR_HYGIENE}`,
    function (error, response, body) {
      expect(response.statusCode).to.equal(200);
    }
  );

  // Check that AcceptedCategory has been deleted
  request(
    process.env.BASE_URL + `data/acceptedcategories/${mockData.ACC_CTG_ID_HOMELESS_SHELTER_FOR_HYGIENE}`,
    function (error, response, body) {
      expect(response.statusCode).to.equal(404);
      done();
    }
  );
});

it('POST Request /data/acceptedcategories/organization/:id : add new AcceptedCategory', function (done) {
  const oldCollectionLength = Object.keys(mockData.firestoreMock._db._collections['dev-AcceptedCategories'])
    .length;
  const newAcceptedCategory = {
    category: `dev-Categories/${mockData.CTG_ID_CLEANING_SUPPLIES}`,
    qualityGuidelines: ['Not toxic', 'No damaged packaging'],
    instructions: ['Dop off your donation for free at our location'],
  };
  const requestOptions = {
    headers: {'content-type': 'application/json'},
    url: process.env.BASE_URL + `data/acceptedcategories/organization/${mockData.ORG_ID_WOMEN_SHELTER}`,
    body: JSON.stringify(newAcceptedCategory),
  }

  request.post(
    requestOptions,
    function (error, response, body) {
      expect(response.statusCode).to.equal(201);
      const currentCollectionLength = Object.keys(
        mockData.firestoreMock._db._collections['dev-AcceptedCategories']
      ).length;
      expect(currentCollectionLength - oldCollectionLength).to.equal(1);
      done();
    }
  );
});

it('GET Request /data/organizations/:id : Get an Organization', function (done) {
  request(process.env.BASE_URL + `data/organizations/${mockData.ORG_ID_FOOD_BANK}`, function (
    error,
    response,
    body
  ) {
    expect(response.statusCode).to.equal(200);
    expect(JSON.parse(response.body)).to.deep.equal(mockData.MOCK_ORGANIZATIONS[mockData.ORG_ID_FOOD_BANK]);
    done();
  });
});

it('POST Request /data/organizations/:id : Update an Organization', function (done) {
  const newName = 'test name';
  const requestOptions = {
    headers: {'content-type': 'application/json'},
    url: process.env.BASE_URL + `data/organizations/${mockData.ORG_ID_FOOD_BANK}`,
    body: JSON.stringify({name: newName}),
  }
  request.post(
   requestOptions,
    function (error, response, body) {
      expect(response.statusCode).to.equal(201);
      expect(
        mockData.firestoreMock.collection('dev-Organizations').doc(`${mockData.ORG_ID_FOOD_BANK}`).get().data()
          .name
      ).to.deep.equal(newName);
      done();
    }
  );
});
