const expect = require('chai').expect;
const request = require('request');
const data = require('../routes/data');
const FirestoreMock = require('firestore-mock');
const { Firestore } = require('@google-cloud/firestore');

const firestoreMock = new FirestoreMock();

const ORG_FURNITURE_BANK_ID = 'ORG100';
const CTG_FURNITURE_ID = 'furniture';
const CTG_FOOD_ID = 'food';
const CTG_CLOTHES_ID = 'clothes';
const CTG_HOUSEHOLD_ITEMS_ID = 'household-items';

const ACCCTG_FURNITURE_BANK_CTG_FURNITURE_ID = 'ACCCTG100';
const ACCCTG_FURNITURE_BANK_CTG_HOUSEHOLD_ITEMS_ID = 'ACCCTG200';
const ACCCTG_FURNITURE_BANK_CTG_FOOD_ID = 'ACCCTG300';

const ORG_FURNITURE_BANK = {
  name: 'Houston Furniture Bank',
  description:
    'The Houston Furniture Bank’s mission is to furnish hope by Making Empty Houses Homes. With the support of industry partners and the Houston community, we work with over 45 social service partner agencies to provide essential furniture to families in need.',
  location: new Firestore.GeoPoint(29.650058, -95.2569975),
  placesID: '',
  email: 'info@houstonfurniturebank.org',
  phone: 7138429771,
  website: 'houstonfurniturebank.org',
  acceptsDropOff: true,
  acceptsPickUp: true,
  acceptsShipping: false,
};

const ACCCTG_FURNITURE_BANK_CTG_FURNITURE = {
  organization: `dev-Organization/${ORG_FURNITURE_BANK_ID}`,
  category: `dev-Categories/${CTG_FURNITURE_ID}`,
  qualityGuidelines: [
    'No tears',
    'No deep cuts and scratches',
    'No stains that are note suppose to be there',
    'No holes',
    'No missing parts',
    'No fire damage',
  ],
  instructions: [
    'Dop off your donation for free at our location',
    'Schedule a pickup of your donation on our website',
  ],
};

const ACCCTG_FURNITURE_BANK_CTG_HOUSEHOLD_ITEMS = {
  organization: `dev-Organizations/${ORG_FURNITURE_BANK_ID}`,
  category: `dev-Categories'/${CTG_HOUSEHOLD_ITEMS_ID}`,
  qualityGuidelines: ['gently used'],
  instructions: [
    'Dop off your donation for free at our location',
    'Schedule a pickup of your donation on our website',
  ],
};

const ACCCTG_FURNITURE_BANK_CTG_FOOD = {
  organization: `dev-Organizations/${ORG_FURNITURE_BANK_ID}`,
  category: `dev-Categories'/${CTG_FOOD_ID}`,
  qualityGuidelines: ['not expired'],
  instructions: ['Put items in bag and drop off'],
};

/**
 * Populates mock database with sample data
 * @param {FirestoreMock} firestore 
 */
function populateMockDatabase(firestore) {
  // Organizations Collection
  firestore
    .collection('dev-Organizations')
    .doc(ORG_FURNITURE_BANK_ID)
    .set(ORG_FURNITURE_BANK);

  // Categories Collection
  firestore
    .collection('dev-Categories')
    .doc(CTG_FURNITURE_ID)
    .set({ name: CTG_FURNITURE_ID });
  firestore
    .collection('dev-Categories')
    .doc(CTG_FOOD_ID)
    .set({ name: CTG_FOOD_ID });
  firestore
    .collection('dev-Categories')
    .doc(CTG_CLOTHES_ID)
    .set({ name: CTG_CLOTHES_ID });
  firestore
    .collection('dev-Categories')
    .doc(CTG_HOUSEHOLD_ITEMS_ID)
    .set({ name: CTG_HOUSEHOLD_ITEMS_ID });

  // AcceptedCategories Collection
  firestore
    .collection('dev-AcceptedCategories')
    .doc(ACCCTG_FURNITURE_BANK_CTG_FURNITURE_ID)
    .set(ACCCTG_FURNITURE_BANK_CTG_FURNITURE);
  firestore
    .collection('dev-AcceptedCategories')
    .doc(ACCCTG_FURNITURE_BANK_CTG_HOUSEHOLD_ITEMS_ID)
    .set(ACCCTG_FURNITURE_BANK_CTG_HOUSEHOLD_ITEMS);
  firestore
    .collection('dev-AcceptedCategories')
    .doc(ACCCTG_FURNITURE_BANK_CTG_FOOD_ID)
    .set(ACCCTG_FURNITURE_BANK_CTG_FOOD);
}

before(function () {
  // Initialize mock Firestore database
  console.log('Initializing Mock Firestore...');
  console.log('Populating Mock Firestore...');
  populateMockDatabase(firestoreMock);
  data.setDatabase(firestoreMock);
  console.log('Mock Database is Set!');
});

it('GET Request /data/categories : Get all categories', function (done) {
  request('http://localhost:3000/data/categories', function (
    error,
    response,
    body
  ) {
    expect(response.statusCode).to.equal(200);
    const expectedBody = [
      CTG_FURNITURE_ID,
      CTG_FOOD_ID,
      CTG_CLOTHES_ID,
      CTG_HOUSEHOLD_ITEMS_ID,
    ];
    expect(JSON.parse(body)).to.deep.equal(expectedBody);
    done();
  });
});

it('GET Request /data/acceptedcategories/:id : get an AcceptedCategory', function (done) {
  request(
    `http://localhost:3000/data/acceptedcategories/${ACCCTG_FURNITURE_BANK_CTG_FURNITURE_ID}`,
    function (error, response, body) {
      expect(response.statusCode).to.equal(200);
      expect(JSON.parse(response.body)).to.deep.equal(
        ACCCTG_FURNITURE_BANK_CTG_FURNITURE
      );
      done();
    }
  );
});

it('POST Request /data/acceptedcategories/:id : update qualityGuidelines field', function (done) {
  request.post(
    {
      headers: { 'content-type': 'application/json' },
      url: `http://localhost:3000/data/acceptedcategories/${ACCCTG_FURNITURE_BANK_CTG_HOUSEHOLD_ITEMS_ID}`,
      body: JSON.stringify({ qualityGuidelines: ['gently used', 'no damage'] }),
    },
    function (error, response, body) {
      expect(response.statusCode).to.equal(201);
      expect(
        firestoreMock
          .collection('dev-AcceptedCategories')
          .doc(`${ACCCTG_FURNITURE_BANK_CTG_HOUSEHOLD_ITEMS_ID}`)
          .get()
          .data().qualityGuidelines
      ).to.deep.equal(['gently used', 'no damage']);
      done();
    }
  );
});

it('DELETE Request /data/acceptedcategories/:id : delete an AcceptedCategory', function (done) {
  request.delete(
    `http://localhost:3000/data/acceptedcategories/${ACCCTG_FURNITURE_BANK_CTG_FOOD_ID}`,
    function (error, response, body) {
      expect(response.statusCode).to.equal(200);
    }
  );

  // Check that AcceptedCategory has been deleted
  request(
    `http://localhost:3000/data/acceptedcategories/${ACCCTG_FURNITURE_BANK_CTG_FOOD_ID}`,
    function (error, response, body) {
      expect(response.statusCode).to.equal(404);
      done();
    }
  );
});

it('POST Request /data/acceptedcategories/organization/:id : add new AcceptedCategory', function (done) {

  const oldCollectionLength = Object.keys(firestoreMock._db._collections['dev-AcceptedCategories']).length;
  const newAcceptedCategory = {
    category: `dev-Categories/${CTG_CLOTHES_ID}`,
    qualityGuidelines: [
      'Gently used',
      'No tears',
      'No holes',
    ],
    instructions: [
      'Dop off your donation for free at our location',
    ],
  }

  request.post(
    {
      headers: { 'content-type': 'application/json' },
      url: `http://localhost:3000/data/acceptedcategories/organization/${ORG_FURNITURE_BANK_ID}`,
      body: JSON.stringify(newAcceptedCategory),
    },
    function (error, response, body) {
      expect(response.statusCode).to.equal(201);
      const currentCollectionLength = Object.keys(firestoreMock._db._collections['dev-AcceptedCategories']).length;
      expect(currentCollectionLength - oldCollectionLength).to.equal(1);
      done();
    }
  );
});
