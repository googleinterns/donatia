/* global Handlebars*/

/**
 * @return {JSON} All category entry information.
 */
async function getAllCategories() {
  const responseData = await fetch('/data/categories');
  const responseDataJSON = await responseData.json();
  const allCategories = responseDataJSON.map(function (category) {
    return {
      ID: category,
      name: category.replace(/-/g, ' '),
    };
  });
  return allCategories;
}

/**
 * Gets all categories that have been accepted by the currently logged in organization.
 * @return {JSON} Object containing all categories used by an organization.
 */
async function getAllAcceptedCategories() {
  const memberData = await (await fetch('/data/member')).json();
  const organizationData = await (await fetch(`/data/organization/member/${memberData.id}`)).json();
  const responseData = await (
    await fetch(`/data/acceptedcategories/organization/${organizationData.id}`)
  ).json();
  const responseDataJSONArray = await Object.entries(responseData);
  const allAcceptedCategories = responseDataJSONArray.map(function (categoryInfo) {
    const categoryKey = categoryInfo[0];
    const categoryValues = categoryInfo[1];
    const categoryName = categoryValues.category._path.segments[1];
    return {
      name: categoryName.replace(/-/g, ' '),
      ID: categoryKey,
      instructions: categoryValues.instructions,
      quality: categoryValues.qualityGuidelines,
    };
  });
  return allAcceptedCategories;
}

/**
 * Converts the values of specified input elements to an array.
 * @param {string} type Name of container to retrieve instructions from.
 * @return {Array<string>} Values from the specified input container.
 */
async function getInstructionsByType(type) {
  const inputArray = [];
  const instructionInputs = await document.querySelectorAll(`.${type}-container > input`);
  Array.prototype.forEach.call(instructionInputs, function (instruction) {
    inputArray.push(instruction.value);
  });
  return inputArray;
}

/**
 * Retrieves values from form and adds to database.
 */
window.addCategory = async function addCategory() {
  const memberData = await (await fetch('/data/member')).json();
  const organizationData = await (await fetch(`/data/organization/member/${memberData.id}`)).json();
  const donationInstructions = await getInstructionsByType('donation');
  const qualityInstructions = await getInstructionsByType('quality');
  fetch(`/data/acceptedcategories/organization/${organizationData.id}`, {
    method: 'POST',
    body: JSON.stringify({
      instructions: donationInstructions,
      qualityGuidelines: qualityInstructions,
      category: document.getElementById('add-categories').value,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).then(location.reload());
};

/**
 * @param {string} categoryID ID of the category to be deleted.
 */
window.deleteCategory = function deleteCategory(categoryID) {
  fetch(`/data/acceptedcategories/${categoryID}`, {
    method: 'DELETE',
  }).then(location.reload());
};

/** Class representing the parts of an instruction element. */
class InstructionTokens {
  /**
   * Extracts the type and index of a properly formatted
   * HTML element ID: [type]-function-[index].
   * @param {string} elementID ID of an element in the instruction section.
   */
  constructor(elementID) {
    this.type = elementID.split('-')[0];
    this.index = parseInt(elementID.split('-')[2]);
  }
}

const inputBoxTemplate = `
  <div id="{{type}}-container-{{index}}" class="{{type}}-container">
    <input id="{{type}}-input-{{index}}" name="{{type}}-input-{{index}}" type="text"></input>
    <button id="{{type}}-remove-{{index}}" onclick="removeInstructionInput(this.id)" hidden>-</button>
    <button id="{{type}}-add-{{index}}" onclick="addInstructionInput(this.id)">+</button><br>
  </div>
`;

/**
 * Adds an input box to the correct section of the page.
 * @param {string} prevInstructionID ID of the previous input
 * box's add button [instructionType]-add-[instructionIndex].
 */
function addInstructionInput(prevInstructionID) {
  const prevInstructionTokens = new InstructionTokens(prevInstructionID);
  const instructionType = prevInstructionTokens.type;
  const prevInstructionIndex = prevInstructionTokens.index;
  const currInstructionIndex = prevInstructionIndex + 1;

  const prevRemoveButton = document.getElementById(
    `${instructionType}-remove-${prevInstructionIndex}`
  );
  if (prevRemoveButton) prevRemoveButton.hidden = false;

  const prevAddButton = document.getElementById(`${instructionType}-add-${prevInstructionIndex}`);
  if (prevAddButton) prevAddButton.hidden = true;

  const renderInputBox = Handlebars.compile(inputBoxTemplate);
  document.getElementById(`${instructionType}-container`).insertAdjacentHTML(
    'beforeend',
    renderInputBox({
      type: instructionType,
      index: currInstructionIndex,
    })
  );
}

/**
 * Removes the input container of the given button.
 * @param {string} instructionID ID of the current input box's
 * remove button [instructionType]-add-[instructionIndex].
 */
window.removeInstructionInput = function removeInstructionInput(instructionID) {
  const instructionTokens = new InstructionTokens(instructionID);
  const instructionContainer = document.getElementById(
    instructionTokens.type + '-container-' + instructionTokens.index
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
