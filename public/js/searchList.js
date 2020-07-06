let searchCardsTemplate;

/*
 * When the page loads, fetch initial organization data and render it
 * in cards on the list.
 */
window.onload = function() {
  updateResults()
}

/**
 * Requery for organization data and refresh page data.
 */
function updateResults() {
  let filter = document.getElementById("search-dropdown").value;
  fetch("/discover/" + filter).then(data => data.json())
  .then(organizations => {
    createOrganizationCards(organizations);
    createMarkers(organizations);
  })
}

/*
 * Renders the organization data into cards.
 * @param {JSON object} organizationsToRender The JSON of organization data to add to the page.
 */
function createOrganizationCards(organizationsToRender) {
  let cardList = document.getElementById("search-list");
  let template = document.getElementsByTagName("template")[0].content;

  organizationsToRender.forEach(organization => {
    let card = document.importNode(template, true);

    // Add general contact information.
    card.querySelector(".search-title").textContent = organization.title;
    card.querySelector(".search-address").textContent = organization.address;
    card.querySelector(".search-phone").textContent = organization.phone;

    // Add check/cross icons for delivery options.
    addDeliverySupportIcon(card, organization.supportsDropOff, /* parentClass = */ ".drop-off");
    addDeliverySupportIcon(card, organization.supportsMailIn, /* parentClass = */ ".mail-in");
    addDeliverySupportIcon(card, organization.supportsPickUp, /* parentClass = */ ".pick-up");

    // Add categories to the card.
    organization.categories.forEach(category => addCategory(card, category));

    cardList.appendChild(card);
  })
}

/*
 * Adds a check or a cross icon to the card for a given devliery option.
 * @param {div element} card The div of the card to add the icons to.
 * @param {boolean} isSupported The boolean for whether that delivery option is supported.
 * @param {string} parentClass The name of the parent class.
 */
function addDeliverySupportIcon(card, isSupported, parentClass) {
  let supportIcon = document.createElement("span");
  supportIcon.className = isSupported ? "valid-symbol" : "invalid-symbol";
  supportIcon.innerText = isSupported ? "✓" : "✗";

  card.querySelector(parentClass).appendChild(supportIcon);
}

/*
 * Adds a search category to the card.
 * @param {div element} card The div of the card to add the categories to.
 * @param {string} category The name of the cateogry being added to the card.
 */
function addCategory(card, category) {
  let categoriesContainer = card.querySelector(".search-categories-contianer");
  let categoryComponent = document.createElement("p");

  categoryComponent.className = "search-category";
  categoryComponent.innerText = category;
  categoriesContainer.appendChild(categoryComponent);
}
