import {createOrganizationCards, selectCard} from './searchList.js';
import {initMap, setLocationInfo, createMarkers, selectMarker, removeAllMarkers} from './maps.js';

/* global categories */

/**
 * When the page loads, fetches initial organization data and render it
 * in cards on the list.
 */
window.onload = function () {
  initMap();
  updateSearchResults();
  setPageEventListeners();
};

/**
 * Add event listeners to the page to link map markers with cards and
 * for search autocomplete.
 */
function setPageEventListeners() {
  // Map marker and organization card hover events.
  const discoverPage = document.getElementById('discover');
  discoverPage.addEventListener('cardChange', (event) => selectMarker(/* id= */ event.detail));
  discoverPage.addEventListener('markerChange', (event) =>
    selectCard(/* id= */ event.detail, /* scroll= */ true)
  );

  // Trigger autocomplete search on selection
  discoverPage.addEventListener('search', () => updateSearchResults());

  // Search if the user presses "enter" in the search box.
  const search = document.getElementById('autocomplete-input');
  search.addEventListener('keydown', function (e) {
    if (e.keyCode === 13) updateSearchResults();
  });
}

/**
 * Requeries for organization data and refreshes page data.
 */
async function updateSearchResults() {
  document.getElementById('autocomplete-list').innerHTML = '';
  document.getElementById('search-list').innerHTML = '';

  // Show loading icon.
  document.getElementById('loading-container').style.display = 'flex';

  removeAllMarkers();

  const filter = document.getElementById('autocomplete-input').value;
  const unparsedFilter = filter === '' ? 'all' : categories[filter];

  // Requery and repopulate page data.
  let data;
  if (document.getElementById('favorite-button').className == 'show-favorites') {
    data = await (await fetch('/data/member/favorites')).json();
  } else {
    data = await (await fetch('/discover/' + unparsedFilter)).json();
  }

  await Promise.all(data.organizations.map(setLocationInfo));
  document.getElementById('loading-container').style.display = 'none';
  createOrganizationCards(data.organizations, data.isLoggedIn);
  createMarkers(data.organizations);
}

/**
 * Alternates results between the user's favorites and all organizations.
 */
window.toggleFavorites = function () {
  const autocompleteBox = document.getElementById('autocomplete-input');
  const favoriteButton = document.getElementById('favorite-button');

  if (favoriteButton.className == 'show-all') {
    favoriteButton.className = 'show-favorites';
    favoriteButton.innerHTML = 'Show All';
    autocompleteBox.disabled = true;
  } else {
    favoriteButton.className = 'show-all';
    favoriteButton.innerHTML = 'Show Favorites';
    autocompleteBox.disabled = false;
  }
  updateSearchResults();
};

window.updateSearchResults = () => updateSearchResults();
