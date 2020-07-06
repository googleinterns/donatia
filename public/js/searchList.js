let searchCardsTemplate;
let organizations;

/**
 * When the page loads, fetch initial organization data and render it
 * in cards on the list.
 */
window.onload = function() {
  fetchOrganizations("all").then(initalOrganizations => {
    organizations = initalOrganizations;
    createOrganizationCards(initalOrganizations);
    generateMarkers(initalOrganizations);
  })
}

/**
 * Fetches the organization data with the given filters from the server.
 * @param {string} filterText The selected item category with which to filer results for.
 */
function fetchOrganizations(filterText) {
  return fetch("/discover", {
    method: 'POST',
    body: JSON.stringify({filter: filterText})
  }).then(data => data.json());
}

/* 
* Renders the organization data into cards.
*/
function createOrganizationCards(organizationsToRender) {
  let cardList = document.getElementById("search-list");
  let template = document.getElementsByTagName("template")[0].content;

  organizationsToRender.forEach(org => {
    let card = document.importNode(template, true);

    // Add general contact information.
    card.querySelector(".search-title").textContent = org.title;
    card.querySelector(".search-address").textContent = org.address;
    card.querySelector(".search-phone").textContent = org.phone;

    // Add check/cross icons for delivery options.
    createDeliverySupportIcon(card, org.supportsDropOff, /* parentClass = */ ".drop-off");
    createDeliverySupportIcon(card, org.supportsMailIn, /* parentClass = */ ".mail-in");
    createDeliverySupportIcon(card, org.supportsPickUp, /* parentClass = */ ".pick-up");

    // Add categories to the card.
    org.categories.forEach(category => createCardCategory(card, category));

    cardList.appendChild(card);
  })
}

/**
 * Adds a check or a cross icon to the card for a given devliery option.
 * @param {div element} card The div of the card to add the icons to.
 * @param {boolean} isSupported The boolean for whether that delivery option is supported.
 * @param {string} parentClass The name of the parent class.
 */
function createDeliverySupportIcon(card, isSupported, parentClass) {
  let supportIcon = document.createElement("span");
  supportIcon.className = isSupported ? "valid-symbol" : "invalid-symbol";
  supportIcon.innerText = isSupported ? "✓" : "✗";

  card.querySelector(parentClass).appendChild(supportIcon);
}

/**
 * Adds a search category to the card.
 * @param {div element} card The div of the card to add the categories to.
 * @param {string} category The name of the cateogry being added to the card.
 */
function createCardCategory(card, category) {
  let categoriesContainer = card.querySelector(".search-categories-contianer");
  let categoryComponent = document.createElement("p");

  categoryComponent.className = "search-category";
  categoryComponent.innerText = category;
  categoriesContainer.appendChild(categoryComponent);
}
