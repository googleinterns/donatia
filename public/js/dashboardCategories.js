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

/**
 * Adds an input box to the correct section of the page.
 * @param {string} prevInstructionID ID of the previous input
 * box's add button [instructionType]-add-[instructionIndex].
 */
function addInstructionInput(prevInstructionID) {
  const prevInstructionIdArr = prevInstructionID.split('-');
  const instructionType = prevInstructionIdArr[0];
  const currInstructionIndex = parseInt(prevInstructionIdArr[2]) + 1;

  const prevRemoveButton = document.getElementById(
    instructionType + '-remove-' + prevInstructionIdArr[2]
  );
  if (prevRemoveButton) prevRemoveButton.hidden = false;

  const prevAddButton = document.getElementById(
    instructionType + '-add-' + prevInstructionIdArr[2]
  );
  if (prevAddButton) prevAddButton.hidden = true;

  const currInstructionDiv = document.createElement('div');
  currInstructionDiv.setAttribute('id', instructionType + '-container-' + currInstructionIndex);

  const inputBox = document.createElement('input');
  inputBox.setAttribute('id', instructionType + '-input-' + currInstructionIndex);
  inputBox.setAttribute('type', 'text');
  inputBox.setAttribute('name', instructionType + '-input-' + currInstructionIndex);

  const removeButton = document.createElement('button');
  removeButton.innerHTML = '-';
  removeButton.setAttribute('id', instructionType + '-remove-' + currInstructionIndex);
  removeButton.setAttribute('onclick', 'removeInstructionInput(this.id)');
  removeButton.hidden = true;

  const addButton = document.createElement('button');
  addButton.innerHTML = '+';
  addButton.setAttribute('id', instructionType + '-add-' + currInstructionIndex);
  addButton.setAttribute('onclick', 'addInstructionInput(this.id)');

  const breakElement = document.createElement('br');

  currInstructionDiv.append(inputBox);
  currInstructionDiv.append(removeButton);
  currInstructionDiv.append(addButton);
  currInstructionDiv.append(breakElement);

  const instructionContainer = document.getElementById(instructionType + '-container');
  instructionContainer.append(currInstructionDiv);
}

/**
 * Removes the input container of the given button.
 * @param {string} instructionID ID of the current input box's
 * remove button [instructionType]-add-[instructionIndex].
 */
window.removeInstructionInput = function removeInstructionInput(instructionID) {
  const instructionIdArr = instructionID.split('-');
  const instructionContainer = document.getElementById(
    instructionIdArr[0] + '-container-' + instructionIdArr[2]
  );
  instructionContainer.remove();
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

  addInstructionInput('quality-add-0');
  addInstructionInput('donation-add-0');
};
