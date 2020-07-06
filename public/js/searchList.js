const BATCH_SIZE = 10;

let searchCardsTemplate;
let organizations;
let fetchingNewOrganizations = false;

/**
 * When the page loads, fetch initial organization data and render it
 * in cards on the list.
 */
window.onload = function() {
  fetchOrganizations("all", BATCH_SIZE).then(initalOrganizations => {
    organizations = initalOrganizations;
    renderOrganizationCards(initalOrganizations);
    generateMarkers(initalOrganizations);
  })
}

/**
 * Load more organization data as the user scrolls to the bottom of the list.
 */
function infinityScroll() {
  let searchContainer = document.getElementById("search");

  // If scrolled to the bottom, fetch more data.
  if (searchContainer.scrollTop + searchContainer.offsetHeight >= searchContainer.scrollHeight) {
    // Don't make a fetch for data if a fetch is already being made.
    if (!fetchingNewOrganizations) {
      fetchingNewOrganizations = true;
      fetchOrganizations("all", BATCH_SIZE, organizations.length)
      .then(newOrganizations => {
        organizations = organizations.concat(newOrganizations);
        renderOrganizationCards(newOrganizations);
        generateMarkers(newOrganizations);
        fetchingNewOrganizations = false;
      })
    }
  }
};

/**
 * Fetches the organization data with the given filters from the server.
 * @param {string} filterText The selected item category with which to filer results for.
 * @param {int} startIndex The index in the query results to start grabbing data at.
 */
function fetchOrganizations(filterText, batchSize, startIndex = 0) {
  return fetch("/discover", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      filter: filterText,
      start: startIndex,
      batchSize: batchSize,
    })
  }).then(data => data.json());
}

/**
 * Renders the organization data into cards.
 * @param {JSON object} organizationsToRender The organizations to render cards for.
 */
function renderOrganizationCards(organizationsToRender) {
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
 * Adds a category bubble to the card.
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
