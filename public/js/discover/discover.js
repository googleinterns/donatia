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
 * for input autocomplete.
 */
function setPageEventListeners() {
  // Event listeners for marker and organization card hover.
  const discoverPage = document.getElementById('discover');
  discoverPage.addEventListener('cardChange', (event) => selectMarker(/* id= */ event.detail));
  discoverPage.addEventListener('markerChange', (event) =>
    selectCard(/* id= */ event.detail, /* scroll= */ true)
  );

  // Event listeners for search.
  const search = document.getElementById("autocomplete-input");
  search.addEventListener("keydown", function (e) {
    // Search if the user presses "enter" in the search box.
    if (e.keyCode === 13) updateSearchResults();
  })
}

/**
 * Requeries for organization data and refreshes page data.
 */
function updateSearchResults() {
  document.getElementById('search-list').innerHTML = '';
  removeAllMarkers();

  let filter = document.getElementById("autocomplete-input").value;
  if (filter === "") filter = "all";

  // Requery and repopulate page data.
  fetch('/discover/' + filter)
    .then((data) => data.json())
    .then((organizations) => {
      createOrganizationCards(organizations);
      createMarkers(organizations);
    });
}

window.updateSearchResults = () => updateSearchResults();
