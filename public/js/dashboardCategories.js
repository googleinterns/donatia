/* global Handlebars*/

/**
 * @return {JSON} All category entry information.
 */
function getAllCategories() {
  // TODO: Get all categories from database.
  const allCategories = [
    {
      ID: 'clothing',
      name: 'Clothing',
    },
    {
      ID: 'food',
      name: 'Food',
    },
    {
      ID: 'house-supplies',
      name: 'Household Supplies',
    },
  ];
  return allCategories;
}

/**
 * @param {string} organizationID ID of organization requesting categories.
 * @return {JSON} Object containing all categories used by an organization.
 */
function getAllAcceptedCategories(organizationID) {
  // TODO: Get an organizations accepted cagtegories from database
  const allAcceptedCategories = [
    {
      name: 'Clothes',
      ID: 'org-name-clothes',
      instructions: [
        'review quality checklist',
        'unlock donation locker (code: 5248)',
        'place in donation locker',
      ],
      quality: ['no holes', 'gently used', 'washed recently'],
    },
    {
      name: 'Food',
      ID: 'org-name-food',
      instructions: [
        'review quality checklist',
        'place in plastic/paper bag',
        'bring inside during open hours',
      ],
      quality: ['expiration date > 6 months from current date', 'no holes', 'labels on cans'],
    },
  ];
  return allAcceptedCategories;
}

/**
 * Retrieves values from form and adds to database.
 */
window.addCategory = function addCategory() {
  // TODO: Add category to database.
  console.log('added a category');
};

/**
 * @param {string} categoryID ID of the category to be deleted.
 */
window.deleteCategory = function deleteCategory(categoryID) {
  console.log('deleted' + categoryID);
};

window.onload = async function () {
  const addCategoriesTemplate = document.getElementById('add-categories-template').innerHTML;
  const renderAddCategories = Handlebars.compile(addCategoriesTemplate);
  const allAvailableCategories = await getAllCategories();
  document.getElementById('add-categories').innerHTML = renderAddCategories({
    categoryList: allAvailableCategories,
  });

  const existingCategoriesTemplate = document.getElementById('existing-cards-template').innerHTML;
  const renderExistingCards = Handlebars.compile(existingCategoriesTemplate);
  const allExistingCards = await getAllAcceptedCategories();
  this.document.getElementById('existing-card-holder').innerHTML = renderExistingCards({
    cardList: allExistingCards,
  });
};
