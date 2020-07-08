const { Firestore } = require('@google-cloud/firestore');

// Database Initialization
const firestore = new Firestore();

exports.acceptedCategoriesResponse = function (req, res) {
  firestore
    .collection(resolveCollectionName('AcceptedCategories'))
    .doc(req.params['id'])
    .get()
    .then((doc) => {
      res.send(doc.data());
    });
};

exports.acceptedCategoriesByFieldResponse = async function (req, res) {
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

exports.categoriesResponse = function (req, res) {
  firestore
    .collection(resolveCollectionName('Categories'))
    .get()
    .then((snapshot) => {
      const categories = [];
      snapshot.forEach((doc) => {
        categories.push(doc.id);
      });
      res.send(categories);
    });
};

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

/**
 * Utility function that returns the correct collection name depending on whther the environment is PRODUCTION or DEVELOPMENT.
 * @param {String} collectionName
 */
function resolveCollectionName(collectionName) {
  return process.env.NODE_ENV == 'production'
    ? collectionName
    : 'dev-' + collectionName;
}
