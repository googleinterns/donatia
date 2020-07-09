import { createOrganizationCards, selectCard } from './searchList.js';
import { initMap, createMarkers, selectMarker, removeAllMarkers } from './maps.js';

const BATCH_SIZE = 5;

let organizationCount = 0;
let isFetchingData = false;

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
 * Add event listeners to the page to select the matching marker on a card
 * hover and vice versa.
 */
function setPageEventListeners() {
  const discoverPage = document.getElementById("discover");
  discoverPage.addEventListener('cardHover', e => selectMarker(e.detail));
  discoverPage.addEventListener('markerHover', e => selectCard(e.detail, /* scroll = */ true));
}

/**
 * Fetches the organization data with the given filters from the server.
 */
function fetchOrganizations() {
  let filter = document.getElementById("search-dropdown").value;

  return fetch("/discover", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      filter: filter,
      start: organizationCount,
      batchSize: BATCH_SIZE,
    })
  }).then(data => data.json());
}

/**
 * Requeries for organization data and refreshes page data.
 */
window.updateSearchResults = function() {
  document.getElementById("search-list").innerHTML = "";
  removeAllMarkers();
  organizationCount = 0;

  fetchOrganizations()
      .then(organizations => {
        createOrganizationCards(organizations);
        createMarkers(organizations);
        organizationCount += organizations.length;
      })
}

/**
 * Load more organization data as the user scrolls to the bottom of the list.
 */
window.infinityScroll = function() {
  let searchContainer = document.getElementById("search");
  
  // If scrolled to the bottom, fetch more data.
  if (searchContainer.scrollTop + searchContainer.offsetHeight >= searchContainer.scrollHeight - .5) {
    // Don't make a fetch for data if a fetch is already being made.
    if (!isFetchingData) {
      isFetchingData = true;
      fetchOrganizations()
          .then(organizations => {
            createOrganizationCards(organizations);
            createMarkers(organizations);
            organizationCount += organizations.length;
            isFetchingData = false;
          })
    }
  }
};
