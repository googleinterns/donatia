import {createOrganizationCards, selectCard} from './searchList.js';
import {initMap, createMarkers, selectMarker, removeAllMarkers} from './maps.js';

/**
 * When the page loads, fetches initial organization data and render it
 * in cards on the list.
 */
window.onload = function() {
  initMap();
  updateSearchResults();
  setPageEventListeners();
}

/**
 * Add event listeners to the page to link map markers with cards and
 * for input autocomplete.
 */
function setPageEventListeners() {
  const discoverPage = document.getElementById("discover");
  discoverPage.addEventListener('cardHover', e => selectMarker(/* id = */ e.detail));
  discoverPage.addEventListener('markerHover', e => selectCard(/* id = */ e.detail, /* scroll = */ true));
  discoverPage.addEventListener('search', e => updateSearchResults());
}

/**
 * Requeries for organization data and refreshes page data.
 */
window.updateSearchResults = function() {
  document.getElementById("search-list").innerHTML = "";
  removeAllMarkers();

  let filter = document.getElementById("autocomplete-input").value;
  if (filter === "") filter = "all";

  // Requery and repopulate page data.
  fetch("/discover/" + filter)
      .then(data => data.json())
      .then(organizations => {
        createOrganizationCards(organizations);
        createMarkers(organizations);
      });
}
