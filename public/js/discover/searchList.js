
const searchCardTemplate = 
    `
      {{#each organizations}}
        <div class="search-card" id="{{this.id}}">
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

/* global createMarkers, Handlebars, removeMarkers*/

/**
 * Renders the organization data into cards.
 * @param {JSON object} organizations The JSON of organization data to add to the page.
 */
export function createOrganizationCards(organizations) {
  // Generate the cards.
  const renderCards = Handlebars.compile(searchCardTemplate);
  document.getElementById("search-list").innerHTML = renderCards({organizations: organizations});

  // Add event listeners to the cards for hovering.
  const searchCards = document.getElementsByClassName("search-card");
  for (let i = 0; i < searchCards.length; i++) {
    const card = searchCards[i];

    card.addEventListener("mouseover", function (e) {
      selectCard(card.id);
      card.dispatchEvent(new CustomEvent('cardHover', {bubbles: true, detail: card.id}));
    });

    card.addEventListener("mouseout", function (e) {
      selectCard();
      card.dispatchEvent(new CustomEvent('cardHover', {bubbles: true, detail: null}));
    });
  }
}

/**
 * Selects and highlights an organization's card in the search list.
 * @param {string} id The id of the organization whose card to select.
 * @param {booolean} scroll Whether or not to scroll to the card.
 */
export function selectCard(id = null, scroll = false) {
  const cards = document.getElementsByClassName("search-card");

  for(let card of cards) {
    if (card.id === id) {
      card.classList.add("selected");
      if (scroll) card.scrollIntoView();
    } else {
      card.classList.remove("selected");
    }
  }
}
