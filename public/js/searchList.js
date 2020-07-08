
const searchCardTemplate = 
    `
      {{#each organizations}}
        <div class="search-card" data-organization="{{this.id}}">
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
 * When the page loads, fetches initial organization data and render it
 * in cards on the list.
 */
window.onload = function() {
  updateResults();
}

/*
 * Requerys for organization data and refreshes page data.
 */
function updateResults() {
  // Clear out current page data.
  document.getElementById("search-list").innerHTML = "";
  removeMarkers();

  // Requery and repopulate page data.
  const filter = document.getElementById("search-dropdown").value;
  fetch("/discover/" + filter).then(data => data.json())
  .then(organizations => {
    createOrganizationCards(organizations);
    createMarkers(organizations);
  })
}

/**
 * Renders the organization data into cards.
 * @param {JSON object} organizations The JSON of organization data to add to the page.
 */
function createOrganizationCards(organizations) {
  // Generate the cards.
  const renderCards = Handlebars.compile(searchCardTemplate);
  document.getElementById("search-list").innerHTML = renderCards({organizations: organizations});

  // Add event listeners to the cards.
  searchCards = document.getElementsByClassName("search-card");
  for (let i = 0; i < searchCards.length; i++) {
    let card = searchCards[i];

    card.addEventListener("mouseover", function (e) {
      card.classList.add("selected");
      openMarker(card.dataset.organization);
    });

    card.addEventListener("mouseout", function (e) {
      card.classList.remove("selected");
      openMarker("");
    });
  }
}
