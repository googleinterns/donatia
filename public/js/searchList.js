const BATCH_SIZE = 10;

let organizationCount = 0;
let fetchingNewOrganizations = false;

const searchCardTemplate = 
    `
      {{#each organizations}}
        <div class="search-card">
          <div class="search-left">
            <div class="search-dropoff-info">
              <h1 class="search-title">{{this.title}}</h1>
              <h2 class="search-address">{{this.address}}</h2>
              <h2 class="search-phone">{{this.phone}}</h2>
            </div>
            <div class="search-dropoff-options">
              {{#*inline "acceptanceSymbol"}}
                {{#if accepts}} <span class="valid-symbol">✓</span> {{else}} <span class="invalid-symbol">✗</span> {{/if}}
              {{/inline}}
              <p>Drop off {{> acceptanceSymbol accepts=this.supportsDropOff}} </p>
              <p>Mail in {{> acceptanceSymbol accepts=this.supportsMailIn}} </p>
              <p>Pick up {{> acceptanceSymbol accepts=this.supportsPickUp}} </p>
            </div>
          </div>
          <div class="search-right">
            <h2>Accepts</h2>
            <div class="search-categories-contianer">
              {{#each this.categories}}
                <p class="search-category">{{this}}</p>
              {{/each}}
            </div>
          </div>
        </div>
      {{/each}}
    `;

/*
 * When the page loads, fetch initial organization data and render it
 * in cards on the list.
 */
window.onload = function() {
  fetchOrganizations("all", BATCH_SIZE).then(organizations => {
    createOrganizationCards(organizations);
    createMarkers(organizations);
    organizationCount += organizations.length;
  })
}

/*
 * Load more organization data as the user scrolls to the bottom of the list.
 */
function infinityScroll() {
  let searchContainer = document.getElementById("search");

  // If scrolled to the bottom, fetch more data.
  if (searchContainer.scrollTop + searchContainer.offsetHeight >= searchContainer.scrollHeight) {
    // Don't make a fetch for data if a fetch is already being made.
    if (!fetchingNewOrganizations) {
      fetchingNewOrganizations = true;
      fetchOrganizations("all", BATCH_SIZE, organizationCount)
      .then(organizations => {
        createOrganizationCards(organizations);
        createMarkers(organizations);
        organizationCount += organizations.length;
        fetchingNewOrganizations = false;
      })
    }
  }
};

/*
 * Fetches the organization data with the given filters from the server.
 * @param {string} filterText The selected item category with which to filer results for.
 * @param {int} startIndex The index in the query results to start grabbing data at.
 */
function fetchOrganizations(filterText, batchSize) {
  return fetch("/discover", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      filter: filterText,
      start: organizationCount,
      batchSize: batchSize,
    })
  }).then(data => data.json());
}

/*
 * Renders the organization data into cards.
 * @param {JSON object} organizations The JSON of organization data to add to the page.
 */
function createOrganizationCards(organizations) {
  const renderCards = Handlebars.compile(searchCardTemplate);
  document.getElementById("search-list").innerHTML += renderCards({organizations: organizations});
}
