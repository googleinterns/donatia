import {createOrganizationCards, selectCard} from './searchList.js';
import {initMap, createMarkers, selectMarker, removeAllMarkers} from './maps.js';

/**
 * When the page loads, fetches initial organization data and render it
 * in cards on the list.
 */
window.onload = function () {
  initMap();
  setSearchOptions();
  setPageEventListeners();
};

/**
 * Add event listeners to the page to select the matching marker on a card
 * hover and vice versa.
 */
function setPageEventListeners() {
  const discoverPage = document.getElementById('discover');
  discoverPage.addEventListener('cardChange', (event) => selectMarker(/* id= */ event.detail));
  discoverPage.addEventListener('markerChange', (event) =>
    selectCard(/* id= */ event.detail, /* scroll= */ true)
  );
}

/**
 * Sets the search dropdown options to the categories from the database.
 */
function setSearchOptions() {
  const select = document.getElementById('search-dropdown');
  fetch('/data/categories')
    .then((data) => data.json())
    .then((data) => {
      for (const category of data) {
        const option = document.createElement('option');

        // Replaces special characters with spaces.
        const parsedCategory = category.replace(/[^a-zA-Z0-9]/g, ' ');
        const capitalizedCategory = capitalize(parsedCategory);
          

        option.value = capitalizedCategory;
        option.innerText = capitalizedCategory;
        select.appendChild(option);
      }
      // After the dropdown options are created, load the organizations.
      updateSearchResults();
    });
}

/**
 * Capitalizes the given string.
 * @param {string} input The uncapitalized string.
 * @return {string} The capitalized string.
 */
function capitalize(input) {
  return input.charAt(0).toUpperCase() + input.slice(1);
}

/**
 * Requeries for organization data and refreshes page data.
 */
function updateSearchResults() {
  document.getElementById('search-list').innerHTML = '';
  removeAllMarkers();

  // Requery and repopulate page data.
  const filter = document.getElementById('search-dropdown').value;
  fetch('/discover/' + filter)
    .then((data) => data.json())
    .then((organizations) => {
      createOrganizationCards(organizations);
      createMarkers(organizations);
    });
}

window.updateSearchResults = () => updateSearchResults();
