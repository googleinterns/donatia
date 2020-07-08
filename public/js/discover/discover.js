import { createOrganizationCards, selectCard } from './searchList.js';
import { initMap, createMarkers, selectMarker, removeAllMarkers } from './maps.js';

/*
 * When the page loads, fetches initial organization data and render it
 * in cards on the list.
 */
window.onload = function() {
  initMap();
  updateSearchResults();
  setPageEventListeners();
  document.getElementById('search-dropdown').onchange = updateSearchResults;
}

/* 
 * Add event listeners to the page to select the matching marker on a card
 * hover and vice versa.
 */
function setPageEventListeners() {
  const discoverPage = document.getElementById("discover");
  discoverPage.addEventListener('cardHover', e => selectMarker(e.detail));
  discoverPage.addEventListener('markerHover', e => selectCard(e.detail, /* scroll = */ true));
}

/*
 * Requerys for organization data and refreshes page data.
 */
function updateSearchResults() {
  // Clear out current page data.
  document.getElementById("search-list").innerHTML = "";
  removeAllMarkers();

  // Requery and repopulate page data.
  let filter = document.getElementById("search-dropdown").value;
  fetch("/discover/" + filter).then(data => data.json())
  .then(organizations => {
    createOrganizationCards(organizations);
    createMarkers(organizations);
  })
}
