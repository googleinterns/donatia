const {Firestore} = require('@google-cloud/firestore');

// Database Initialization
let firestore = new Firestore();

/**
 * Utility function that returns the correct collection name depending on whther the environment is PRODUCTION or DEVELOPMENT.
 * @param {String} collectionName
 * @return {string} the collection name under the current node environment
 */
function resolveCollectionName(collectionName) {
  return process.env.NODE_ENV == 'production' ? collectionName : 'dev-' + collectionName;
}

exports.setDatabase = (firestoreInstance) => (firestore = firestoreInstance);

exports.getDatabase = () => firestore;

/**
 * Queries for all AcceptedCategories by either organization or category depending on the document reference and fieldName
 * @param {FirebaseFirestore.DocumentReference} ref
 * @param {String} fieldName
 * @return {Array} array of all AcceptedCategories that match the reference
 */
async function getAcceptedGategoriesByRef(ref, fieldName) {
  const snapshot = await firestore
    .collection(resolveCollectionName('AcceptedCategories'))
    .where(fieldName, '==', ref)
    .get();
  const results = {};
  snapshot.docs.forEach((doc) => {
    results[doc.id] = doc.data();
  });
  return results;
}

/* Response Handlers */

exports.acceptedCategoriesGet = async function (req, res) {
  const doc = await firestore
    .collection(resolveCollectionName('AcceptedCategories'))
    .doc(req.params['id'])
    .get();

  if (doc.exists) {
    res.send(doc.data());
  } else {
    res.sendStatus(404);
  }
};

exports.acceptedCategoriesPost = async function (req, res) {
  const updatedAcceptedCategoryData = req.body;

  // If there is an update to the category field then change string into DocumentReference
  if ('category' in updatedAcceptedCategoryData) {
    updatedAcceptedCategoryData.category = await firestore.doc(
      `/${resolveCollectionName('Categories')}/${req.body.category}`
    );
  }

  await firestore
    .collection(`${resolveCollectionName('AcceptedCategories')}`)
    .doc(`${req.params.id}`)
    .update(updatedAcceptedCategoryData);
  res.sendStatus(201);
};

exports.acceptedCategoriesDelete = async function (req, res) {
  await firestore
    .collection(`${resolveCollectionName('AcceptedCategories')}`)
    .doc(`${req.params.id}`)
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
    fieldReference = firestore.collection(resolveCollectionName('Categories')).doc(req.params.id);
  }

  const results = await getAcceptedGategoriesByRef(fieldReference, req.params.field);

  res.send(results);
};

exports.acceptedCategoriesOrganizationPost = async function (req, res) {
  const newAcceptedCategoryData = req.body;
  newAcceptedCategoryData.organization = await firestore
    .collection(`${resolveCollectionName('Organization')}`)
    .doc(`${req.params.id}`);
  newAcceptedCategoryData.category = await firestore
    .collection(`${resolveCollectionName('Categories')}`)
    .doc(`${req.body.category}`);

  await firestore
    .collection(resolveCollectionName('AcceptedCategories'))
    .doc()
    .set(newAcceptedCategoryData);
  res.sendStatus(201);
};

exports.categoriesGet = async function (req, res) {
  const snapshot = await firestore.collection(resolveCollectionName('Categories')).get();
  const categories = [];
  snapshot.forEach((doc) => {
    categories.push(doc.id);
  });
  res.send(categories);
};

exports.memberGet = async function (req, res) {
  const memberData = req.user;
  const userData = {
    authenticationID: memberData.id,
    name: memberData.displayName,
  };
  const memberSnapshot = await firestore
    .collection(resolveCollectionName('Members'))
    .where('authenticationID', '==', memberData.id);

  memberSnapshot.get().then(function (doc) {
    if (doc.docs[0]) {
      res.json({id: doc.docs[0].id});
    } else {
      firestore
        .collection(resolveCollectionName('Members'))
        .doc()
        .set(userData)
        .then(
          memberSnapshot.get().then(function (doc) {
            res.json({id: doc.docs[0].id});
          })
        );
    }
  });
};

exports.getOrganizationFromMember = async function (req, res) {
  const organizationReference = firestore
    .collection(resolveCollectionName('Organizations'))
    .doc(req.params.id);

  const memberAssignments = await firestore
    .collection(resolveCollectionName('MemberAssignments'))
    .where('organization', '==', organizationReference)
    .get();

  const memberReference = await memberAssignments.docs[0].data().member._path.segments;
  const memberInfo = await firestore.collection(memberReference[0]).doc(memberReference[1]).get();
  res.send(memberInfo.data());
};

exports.getMemberFromOrganization = async function (req, res) {
  const memberReference = firestore.collection(resolveCollectionName('Members')).doc(req.params.id);

  const memberAssignments = await firestore
    .collection(resolveCollectionName('MemberAssignments'))
    .where('member', '==', memberReference)
    .get();

  const organizationReference = await memberAssignments.docs[0].data().organization._path.segments;

  const organizationInfo = await firestore
    .collection(organizationReference[0])
    .doc(organizationReference[1])
    .get();

  res.json({id: organizationInfo.id});
};

exports.organizationsGet = async function (req, res) {
  const organization = await firestore
    .collection(resolveCollectionName('Organizations'))
    .doc(`${req.params.id}`)
    .get();

  if (organization.exists) {
    res.send(organization.data());
  } else {
    res.sendStatus(404);
  }
};

exports.organizationsPost = async function (req, res) {
  const newOrgData = req.body;
  newOrgData.acceptsDropOff = newOrgData.acceptsDropOff ? true : false;
  newOrgData.acceptsPickUp = newOrgData.acceptsPickUp ? true : false;
  newOrgData.acceptsShipping = newOrgData.acceptsShipping ? true : false;
  await firestore
    .collection(resolveCollectionName('Organizations'))
    .doc(`${req.params.id}`)
    .update(newOrgData);
  res.redirect('/dashboard');
};
