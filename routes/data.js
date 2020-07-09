const { Firestore } = require('@google-cloud/firestore');

// Database Initialization
let firestore = new Firestore();

/**
 * Utility function that returns the correct collection name depending on whther the environment is PRODUCTION or DEVELOPMENT.
 * @param {String} collectionName
 */
function resolveCollectionName(collectionName) {
  return process.env.NODE_ENV == 'production'
    ? collectionName
    : 'dev-' + collectionName;
}

function setDatabase(firestoreInstance) {
  firestore = firestoreInstance;
}

/**
 * Queries for all AcceptedCategories by either organization or category depending on the  document reference and fieldName
 * @param {FirebaseFirestore.DocumentReference} ref
 * @param {String} fieldName
 */
async function getAcceptedGategoriesByRef(ref, fieldName) {
  const snapshot = await firestore
    .collection(resolveCollectionName('AcceptedCategories'))
    .where(fieldName, '==', ref)
    .get();
  let results = {};
  snapshot.docs.forEach((doc) => {
    results[doc.id] = doc.data();
  });
  return results;
}

/******** Response Handlers **************/

exports.acceptedCategoriesGet = async function (req, res) {
  const doc = await firestore
    .collection(resolveCollectionName('AcceptedCategories'))
    .doc(req.params['id'])
    .get();
  res.send(doc.data());
};

exports.acceptedCategoriesPost = async function (req, res) {
  const updatedAcceptedCategoryData = req.body;

  // If there is an update to the category field then change string into DocumentReference
  if (updatedAcceptedCategoryData.hasOwnProperty('category')) {
    updatedAcceptedCategoryData.category = await firestore.doc(
      `/${resolveCollectionName('Categories')}/${req.body.category}`
    );
  }

  const result = await firestore.doc(
    `/${resolveCollectionName('AcceptedCategories')}/${req.params.id}`
  ).update(updatedAcceptedCategoryData);
  res.sendStatus(201);
};

exports.acceptedCategoriesDelete = async function (req, res) {
  const results = await firestore
    .doc(`/${resolveCollectionName('AcceptedCategories')}/${req.params.id}`)
    .delete();
  res.sendStatus(200);
};

exports.acceptedCategoriesByFieldGet = async function (req, res) {
  let fieldReference;
  if (req.params.field == 'organization') {
    fieldReference = firestore
      .collection(resolveCollectionName('Organizations'))
      .doc(req.params.id);
  } else if (req.params.field == 'category') {
    fieldReference = firestore
      .collection(resolveCollectionName('Categories'))
      .doc(req.params.id);
  }

  let results = await getAcceptedGategoriesByRef(
    fieldReference,
    req.params.field
  );

  res.send(results);
};

exports.acceptedCategoriesOrganizationPost = async function (req, res) {
  const newAcceptedCategoryData = req.body;
  newAcceptedCategoryData.organization = await firestore.doc(
    `/${resolveCollectionName('Organization')}/${req.params.id}`
  );
  newAcceptedCategoryData.category = await firestore.doc(
    `/${resolveCollectionName('Categories')}/${req.body.category}`
  );

  const result = await firestore
    .collection(resolveCollectionName('AcceptedCategories'))
    .doc()
    .set(newAcceptedCategoryData);
  res.sendStatus(201);
};

exports.categoriesGet = async function (req, res) {
  const snapshot = await firestore
    .collection(resolveCollectionName('Categories'))
    .get();
  const categories = [];
  snapshot.forEach((doc) => {
    categories.push(doc.id);
  });
  res.send(categories);
};
