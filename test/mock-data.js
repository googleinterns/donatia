const FirestoreMock = require('firestore-mock');

// Categories
const CTG_ID_FURNITURE = 'furniture';
const CTG_ID_FOOD = 'food';
const CTG_ID_CLOTHES = 'clothes';
const CTG_ID_CLEANING_SUPPLIES = 'cleaning-supplies';
const CTG_ID_HYGIENE_PRODUCTS = 'hygiene-products';
const MOCK_CATEGORIES = {
  [CTG_ID_FURNITURE]: {name:CTG_ID_FURNITURE}, 
  [CTG_ID_FOOD]: {name:CTG_ID_FOOD},
  [CTG_ID_CLOTHES]: {name:CTG_ID_CLOTHES},
  [CTG_ID_CLEANING_SUPPLIES]: {name:CTG_ID_CLEANING_SUPPLIES}, 
  [CTG_ID_HYGIENE_PRODUCTS]: {name:CTG_ID_HYGIENE_PRODUCTS },
}

// Organization
const ORG_ID_WOMEN_SHELTER = 'ORG100';
const ORG_ID_HOMELESS_SHELTER = 'ORG200';
const ORG_ID_FURNITURE_BANK = 'ORG300';
const ORG_ID_FOOD_BANK = 'ORG400';

const ORG_WOMEN_SHELTER = {
  name: 'Women Shelter',
  description:
    'Shelter for women and children affected by violence.',
  location: {lng: 10, lat: 25},
  placesID: 'PLACESID_1',
  email: 'info@womenshelter.org',
  phone: 6274150815,
  website: 'womenshelter.org',
  acceptsDropOff: true,
  acceptsPickUp: false,
  acceptsShipping: true,
}

const ORG_HOMELESS_SHELTER = {
  name: 'Homeless Shelter',
  description:
    'Our missions is to make sure everyone can have a home.',
  location: {lng: 45, lat: 30},
  placesID: 'PLACESID_2',
  email: 'info@homelessshelter.org',
  phone: 3448562310,
  website: 'homelessshelter.org',
  acceptsDropOff: true,
  acceptsPickUp: false,
  acceptsShipping: false,
}

const ORG_FURNITURE_BANK = {
  name: 'Furniture Bank',
  description:
    'Giving furniture a new life and giving life to homes',
  location: {lng: 60, lat: 75},
  placesID: 'PLACESID_3',
  email: 'info@furniturebank.org',
  phone: 7649025295,
  website: 'furniturebank.org',
  acceptsDropOff: true,
  acceptsPickUp: true,
  acceptsShipping: false,
}

const ORG_FOOD_BANK = {
  name: 'Food Bank',
  description:
    'Our mission is to make sure that no one goes hungry',
  location: {lng: 15, lat: 55},
  placesID: 'PLACESID_4',
  email: 'info@foodbank.org',
  phone: 7593862175,
  website: 'foodbank.org',
  acceptsDropOff: true,
  acceptsPickUp: true,
  acceptsShipping: false,
}

const MOCK_ORGANIZATIONS = {
 [ORG_ID_WOMEN_SHELTER]: ORG_WOMEN_SHELTER, 
 [ORG_ID_HOMELESS_SHELTER]: ORG_HOMELESS_SHELTER, 
 [ORG_ID_FURNITURE_BANK]: ORG_FURNITURE_BANK, 
 [ORG_ID_FOOD_BANK]: ORG_FOOD_BANK, 
};

// Accepted Categories
const ACC_CTG_ID_WOMEN_SHELTER_FOR_HYGIENE = 'ACCCTG100';
const ACC_CTG_ID_WOMEN_SHELTER_FOR_CLOTHES = 'ACCCTG200';
const ACC_CTG_ID_HOMELESS_SHELTER_FOR_CLOTHES = 'ACCCTG300';
const ACC_CTG_ID_HOMELESS_SHELTER_FOR_HYGIENE = 'ACCCTG400';
const ACC_CTG_ID_FURNITURE_BANK_FOR_FURNITURE = 'ACCCTG500';
const ACC_CTG_ID_FOOD_BANK_FOR_FOOD = 'ACCCTG600';

const ACC_CTG_WOMEN_SHELTER_FOR_HYGIENE = {
  organization: `dev-Organization/${ORG_ID_WOMEN_SHELTER}`,
  category: `dev-Categories/${CTG_ID_HYGIENE_PRODUCTS}`,
  qualityGuidelines: [
    'Must be in new condition, no used items',
    'No damaged packaging'
  ],
  instructions: [
    'Package mutliple items in bag or box',
    'Drop off donation at our locaiton',
  ],
};

const ACC_CTG_WOMEN_SHELTER_FOR_CLOTHES = {
  organization: `dev-Organization/${ORG_ID_WOMEN_SHELTER}`,
  category: `dev-Categories/${CTG_ID_CLOTHES}`,
  qualityGuidelines: [
    'Must be in new condition, no used items',
  ],
  instructions: [
    'Drop off donations at our location',
  ],
};

const ACC_CTG_HOMELESS_SHELTER_FOR_CLOTHES = {
    organization: `dev-Organization/${ORG_HOMELESS_SHELTER}`,
  category: `dev-Categories/${CTG_ID_CLOTHES}`,
  qualityGuidelines: [
    'Gently used',
    'No stains',
    'No rips or tears',
  ],
  instructions: [
    'Make sure all clothes are washed',
    'Drop off donations at our location',
  ],
};

const ACC_CTG_HOMELESS_SHELTER_FOR_HYGIENE = {
  organization: `dev-Organization/${ORG_ID_HOMELESS_SHELTER}`,
  category: `dev-Categories/${CTG_ID_HYGIENE_PRODUCTS}`,
  qualityGuidelines: [
    'Must be new',
    'No damaged packaging'
  ],
  instructions: [
    'Organize donation items into bags or boxes',
    'Drop off your items at our location',
  ],
};

const ACC_CTG_FURNITURE_BANK_FOR_FURNITURE = {
  organization: `dev-Organization/${ORG_ID_FURNITURE_BANK}`,
  category: `dev-Categories/${ORG_ID_FURNITURE_BANK}`,
  qualityGuidelines: [
    'No holes, scratches, or cuts',
    'No fire damage',
    'No pet hair',
  ],
  instructions: [
    'Drop off your items at our location',
    'Schedule a free pickup of you items on our website',
  ],
};

const ACC_CTG_FOOD_BANK_FOR_FOOD = {
  organization: `dev-Organization/${ORG_ID_FOOD_BANK}`,
  category: `dev-Categories/${CTG_ID_FOOD}`,
  qualityGuidelines: [
    'No damage to packaging',
    'Not expired'
  ],
  instructions: [
    'Drop off donation items at our location'
  ],
};

const MOCK_ACCEPTED_CATEGORIES = {
   [ACC_CTG_ID_WOMEN_SHELTER_FOR_HYGIENE]: ACC_CTG_WOMEN_SHELTER_FOR_HYGIENE,
   [ACC_CTG_ID_WOMEN_SHELTER_FOR_CLOTHES]: ACC_CTG_WOMEN_SHELTER_FOR_CLOTHES,
   [ACC_CTG_ID_HOMELESS_SHELTER_FOR_CLOTHES]: ACC_CTG_HOMELESS_SHELTER_FOR_CLOTHES,
   [ACC_CTG_ID_HOMELESS_SHELTER_FOR_HYGIENE]: ACC_CTG_HOMELESS_SHELTER_FOR_HYGIENE,
   [ACC_CTG_ID_FURNITURE_BANK_FOR_FURNITURE]: ACC_CTG_FURNITURE_BANK_FOR_FURNITURE,
   [ACC_CTG_ID_FOOD_BANK_FOR_FOOD]: ACC_CTG_FOOD_BANK_FOR_FOOD,
}

// Mock Database Initialization
const firestoreMock = new FirestoreMock();

/**
 * Populates mock database with sample data
 */
exports.populateMockDatabase = () => {
  for(CTG_ID in MOCK_CATEGORIES) {
    firestoreMock
      .collection('dev-Categories')
      .doc(CTG_ID)
      .set(MOCK_CATEGORIES[CTG_ID]);
  }

  for(ORG_ID in MOCK_ORGANIZATIONS) {
    firestoreMock
      .collection('dev-Organizations')
      .doc(ORG_ID)
      .set(MOCK_ORGANIZATIONS[ORG_ID]);
  }

  for(ACC_CTG_ID in MOCK_ACCEPTED_CATEGORIES) {
    firestoreMock
      .collection('dev-AcceptedCategories')
      .doc(ACC_CTG_ID)
      .set(MOCK_ACCEPTED_CATEGORIES[ACC_CTG_ID]);
    }
}

//exports
exports.CTG_ID_FURNITURE = CTG_ID_FURNITURE;
exports.CTG_ID_FOOD = CTG_ID_FOOD;
exports.CTG_ID_CLOTHES = CTG_ID_CLOTHES;
exports.CTG_ID_CLEANING_SUPPLIES = CTG_ID_CLEANING_SUPPLIES;
exports.CTG_ID_HYGIENE_PRODUCTS = CTG_ID_HYGIENE_PRODUCTS;
exports.MOCK_CATEGORIES = MOCK_CATEGORIES;
exports.ORG_ID_WOMEN_SHELTER = ORG_ID_WOMEN_SHELTER;
exports.ORG_ID_HOMELESS_SHELTER = ORG_ID_HOMELESS_SHELTER;
exports.ORG_ID_FURNITURE_BANK = ORG_ID_FURNITURE_BANK;
exports.ORG_ID_FOOD_BANK = ORG_ID_FOOD_BANK;
exports.MOCK_ORGANIZATIONS = MOCK_ORGANIZATIONS;
exports.ACC_CTG_ID_WOMEN_SHELTER_FOR_HYGIENE = ACC_CTG_ID_WOMEN_SHELTER_FOR_HYGIENE;
exports.ACC_CTG_ID_WOMEN_SHELTER_FOR_CLOTHES = ACC_CTG_ID_WOMEN_SHELTER_FOR_CLOTHES;
exports.ACC_CTG_ID_HOMELESS_SHELTER_FOR_CLOTHES = ACC_CTG_ID_HOMELESS_SHELTER_FOR_CLOTHES;
exports.ACC_CTG_ID_HOMELESS_SHELTER_FOR_HYGIENE = ACC_CTG_ID_HOMELESS_SHELTER_FOR_HYGIENE;
exports.ACC_CTG_ID_FURNITURE_BANK_FOR_FURNITURE = ACC_CTG_ID_FURNITURE_BANK_FOR_FURNITURE;
exports.ACC_CTG_ID_FOOD_BANK_FOR_FOOD = ACC_CTG_ID_FOOD_BANK_FOR_FOOD;
exports.MOCK_ACCEPTED_CATEGORIES = MOCK_ACCEPTED_CATEGORIES;
exports.firestoreMock = firestoreMock;




