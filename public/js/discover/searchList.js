import {formatPhoneNumber} from '/static/js/global.js';

const searchCardTemplate = `
      {{#each organizations}}
        <div class="search-card" id="{{this.id}}">
          <div class="search-left">
            <div class="search-dropoff-info">
              <h1 class="search-title">{{this.name}}</h1>
              <h2 class="search-address">{{this.address}}</h2>
              <h2 class="search-phone">{{this.phone}}</h2>
            </div>
            <div class="search-dropoff-options">
              {{#*inline "acceptanceSymbol"}}
                {{#if accepts}} <span class="valid-symbol">✓</span> {{else}} <span class="invalid-symbol">✗</span> {{/if}}
              {{/inline}}
              <p>Drop off {{> acceptanceSymbol accepts=this.acceptsDropOff}} </p>
              <p>Ship in {{> acceptanceSymbol accepts=this.acceptsShipping}} </p>
              <p>Pick up {{> acceptanceSymbol accepts=this.acceptsPickUp}} </p>
            </div>
          </div>
          <div class="search-right">
            <div>
              <h2>Accepts</h2>
              <div class="search-categories-container">
                {{#each this.categories}}
                  <p class="search-category">{{this}}</p>
                {{/each}}
              </div>
             </div>
              {{#if ../isLoggedIn}}
                <img 
                  class="favorite-icon" 
                  onclick="toggleFavorite(event, '{{this.id}}')"
                  data-favorited="{{this.favorite}}"
                  {{#if this.favorite}} src="static/images/favorite-solid.svg" 
                  {{else}} src="static/images/favorite-hollow.svg" {{/if}}>
              {{/if}}
          </div>
        </div>
      {{/each}}
    `;

/* global Handlebars */

/**
 * Renders the organization data into cards.
 * @param {JSON} organizations The JSON of organization data to add to the page.
 * @param {boolean} isLoggedIn Whether or not a user is logged in.
 */
export function createOrganizationCards(organizations, isLoggedIn = false) {
  // Parse organization phone numbers.
  organizations.forEach((organization) => {
    organization.phone = formatPhoneNumber(organization.phone);
    organization.categories = organization.categories.map((category) =>
      category.replace(/[^a-zA-Z0-9]/g, ' ')
    );
  });

  // Generate the cards.
  const renderCards = Handlebars.compile(searchCardTemplate);
  document.getElementById('search-list').innerHTML = renderCards({
    organizations: organizations,
    isLoggedIn: isLoggedIn,
  });

  // Add event listeners to the cards for hovering.
  const searchCards = document.getElementsByClassName('search-card');
  for (const card of searchCards) {
    card.addEventListener('mouseover', function (event) {
      selectCard(card.id);
      card.dispatchEvent(new CustomEvent('cardChange', {bubbles: true, detail: card.id}));
    });

    card.addEventListener('mouseout', function (event) {
      selectCard();
      card.dispatchEvent(new CustomEvent('cardChange', {bubbles: true, detail: null}));
    });

    card.addEventListener('click', function (event) {
      window.open(`/discover/organization/${card.id}`, '_blank');
    });
  }
}

/**
 * Selects and highlights an organization's card in the search list.
 * @param {string} id The id of the organization whose card to select.
 * @param {booolean} scroll Whether or not to scroll to the card.
 */
export function selectCard(id = null, scroll = false) {
  const searchcards = document.getElementsByClassName('search-card');

  for (const card of searchcards) {
    if (card.id === id) {
      card.classList.add('selected');
      if (scroll) card.scrollIntoView();
    } else {
      card.classList.remove('selected');
    }
  }
}

/**
 * Toggles the favorite staus of for that organization.
 * @param {event} event The onclick event that triggered the favorite.
 * @param {String} id The id of the organization to be toggled.
 */
window.toggleFavorite = function (event, id) {
  // Disregard card click to open more info page.
  event.stopImmediatePropagation();

  const favoriteIcon = event.target;
  const favorited = favoriteIcon.dataset.favorited === 'true';

  if (favorited) {
    fetch('/data/member/favorites/' + id, {method: 'DELETE'}).then(() => {
      favoriteIcon.src = 'static/images/favorite-hollow.svg';
      favoriteIcon.dataset.favorited = 'false';
    });
  } else {
    fetch('/data/member/favorites/' + id, {method: 'POST'}).then(() => {
      favoriteIcon.src = 'static/images/favorite-solid.svg';
      favoriteIcon.dataset.favorited = 'true';
    });
  }
};
