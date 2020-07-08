const {Firestore} = require('@google-cloud/firestore');

// Database Initialization
const firestore = new Firestore();

exports.acceptedCategoriesResponse = function(req, res) {
  firestore.collection(resolveCollectionName('AcceptedCategories')).doc(req.params['id']).get().then(
    doc => {
      res.send(doc.data());
    }
  );
};

exports.acceptedCategoriesByOrganizationResponse = async function(req, res) {
  const organizationRef = firestore.collection(resolveCollectionName('Organizations')).doc(req.params['id']);
  const results = await getAcceptedGategoriesByRef(organizationRef, 'organization');
  res.send(results);
};

exports.acceptedCategoriesByCategoryResponse = async function(req, res) {
  const categoryRef = firestore.collection(resolveCollectionName('Categories')).doc(req.params['id']);
  let results = await getAcceptedGategoriesByRef(categoryRef, 'category');
  res.send(results);
};

exports.categoriesResponse = function(req, res) {
  firestore.collection(resolveCollectionName('Categories')).get().then(snapshot => {
    const categories = [];
    snapshot.forEach(doc => {
      categories.push(doc.id);
    });
    res.send(categories);
  });
};

async function getAcceptedGategoriesByRef(ref, fieldName) {
  const snapshot = await firestore.collection(resolveCollectionName('AcceptedCategories')).where(fieldName, '==', ref).get();
  let results = {};
  snapshot.docs.forEach(doc => {
    results[doc.id] = doc.data();
  })
  return results;
}

function resolveCollectionName(collectionName) {
  return (process.env.NODE_ENV == 'production') ? 
    collectionName : 'dev-' + collectionName;
}
