const {Firestore} = require('@google-cloud/firestore');
const fetch = require('node-fetch');

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
async function getAcceptedCategoriesByRef(ref, fieldName) {
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

/**
 * Fetches all organizations from the database.
 * @return {array} The list of all organizations.
 */
exports.getAllOrganizations = async function () {
  const organizations = await firestore.collection(resolveCollectionName('Organizations')).get();

  const parsedOrganizations = [];

  for (const doc of organizations.docs) {
    const data = doc.data();
    data['id'] = doc.id;
    data['categories'] = await getOrganizationCategories(doc.ref);

    parsedOrganizations.push(data);
  }

  return parsedOrganizations;
};

/**
 * Queries the database for organizations with the given item category.
 * @param {String} filter The category name to filter organizations by.
 * @return {array} The list of filtered organizations.
 */
exports.getFilteredOrganizations = async function (filter) {
  filter = filter.toLowerCase();

  const categoryReference = await firestore
    .collection(resolveCollectionName('Categories'))
    .doc(filter);
  const acceptedCategories = await getAcceptedCategoriesByRef(categoryReference, 'category');

  const organizations = [];

  for (const acceptedCategoryId in acceptedCategories) {
    if (Object.prototype.hasOwnProperty.call(acceptedCategories, acceptedCategoryId)) {
      const organizationReference = acceptedCategories[acceptedCategoryId].organization;
      const organizationSnapshot = await organizationReference.get();

      const organization = organizationSnapshot.data();
      organization['id'] = organizationSnapshot.id;
      organization['categories'] = await getOrganizationCategories(organizationReference);

      organizations.push(organization);
    }
  }
  return organizations;
};

/**
 * Gets all categories from the firestore database.
 * @return {array} The list of categories.
 */
exports.getCategories = async function () {
  const snapshot = await firestore.collection(resolveCollectionName('Categories')).get();
  return snapshot.docs.map((doc) => doc.id);
};

/**
 * Retrieves the list of categories accepted by an organization.
 * @param {Reference} organizationReference The Firestore reference to an organization.
 * @return {Array} The list of accepted categories by the organization.
 */
async function getOrganizationCategories(organizationReference) {
  const categories = [];
  const acceptedCategories = await getAcceptedCategoriesByRef(
    organizationReference,
    'organization'
  );
  for (const key in acceptedCategories) {
    if (Object.prototype.hasOwnProperty.call(acceptedCategories, key)) {
      const category = acceptedCategories[key].category.id;
      categories.push(category);
    }
  }
  return categories;
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

  const results = await getAcceptedCategoriesByRef(fieldReference, req.params.field);

  res.send(results);
};

exports.acceptedCategoriesOrganizationPost = async function (req, res) {
  const newAcceptedCategoryData = req.body;
  newAcceptedCategoryData.organization = await firestore
    .collection(`${resolveCollectionName('Organizations')}`)
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

exports.getMember = async function (req, res) {
  const memberData = req.user;
  const userData = {
    authenticationID: memberData.id,
    name: memberData.displayName,
  };
  const memberSnapshot = await firestore
    .collection(resolveCollectionName('Members'))
    .where('authenticationID', '==', memberData.id);

  memberSnapshot.get().then(function (doc) {
    // Check if a member with the specified authentication ID exists.
    if (doc.docs[0]) {
      // If the member is found, send their ID.
      res.json({id: doc.docs[0].id});
    } else {
      // Otherwise, create a new member and return their newly created ID.
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
  const organizationDoc = await memberAssignments.docs[0];

  // Return undefined if the organization hasn't been approved yet.
  if (!organizationDoc) {
    res.json({id: undefined});
    return;
  }

  const organizationReference = organizationDoc.data().organization._path.segments;

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

  // If placeID was not populated, retrieve it.
  if (newOrgData.placeID == '') {
    const placeJSON = await (
      await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${newOrgData.address}&key=${process.env.MAPS_KEY}`
      )
    ).json();
    newOrgData.placeID = placeJSON.results[0].place_id;
  }
  delete newOrgData.address;

  newOrgData.acceptsDropOff = !!newOrgData.acceptsDropOff;
  newOrgData.acceptsPickUp = !!newOrgData.acceptsPickUp;
  newOrgData.acceptsShipping = !!newOrgData.acceptsShipping;
  await firestore
    .collection(resolveCollectionName('Organizations'))
    .doc(`${req.params.id}`)
    .update(newOrgData);
  res.redirect('/dashboard');
};

exports.updatePlaceIDs = async function (req, res) {
  // Get all entries from the Organizations table.
  const organizations = await firestore.collection(resolveCollectionName('Organizations')).get();

  let tasksCompleted = '';

  await Promise.all(
    organizations.docs.map(async (doc) => {
      const oldPlaceID = doc.data().placeID;
      const placeName = doc.data().name;

      if (oldPlaceID) {
        // If the current entry has a placeID, check if it is the latest one.
        const placeJSON = await (
          await fetch(
            `https://maps.googleapis.com/maps/api/place/details/json?place_id=${oldPlaceID}&fields=place_id&key=${process.env.MAPS_KEY}`
          )
        ).json();
        const newPlaceID = placeJSON.result.place_id;

        // Update the current doc's placeID if a newer placeID has been retrieved.
        if (!!newPlaceID && newPlaceID != oldPlaceID) {
          doc._ref.update({
            placeID: newPlaceID,
          });
          tasksCompleted += `Updated ${placeName}. `;
        }
      } else {
        tasksCompleted += `Missing placeID: ${placeName}. `;
      }
    })
  );
  res.json(tasksCompleted);
};
