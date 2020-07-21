import {createOrganizationCards, selectCard} from './searchList.js';
import {initMap, createMarkers, selectMarker, removeAllMarkers} from './maps.js';

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

  // Search if the user presses "enter" in the search box.
  const search = document.getElementById('autocomplete-input');
  search.addEventListener('keydown', function (e) {
    if (e.keyCode === 13) updateSearchResults();
  });
}

/**
 * Requeries for organization data and refreshes page data.
 */
function updateSearchResults() {
  document.getElementById('autocomplete-list').innerHTML = '';
  document.getElementById('search-list').innerHTML = '';
  removeAllMarkers();

  let parsedFilter = document.getElementById('autocomplete-input').value;
  if (parsedFilter === '') parsedFilter = 'all';

  const filter = categories[parsedFilter];

  // Requery and repopulate page data.
  fetch('/discover/' + filter)
    .then((data) => data.json())
    .then((organizations) => {
      createOrganizationCards(organizations);
      createMarkers(organizations);
    });
}

window.updateSearchResults = () => updateSearchResults();
