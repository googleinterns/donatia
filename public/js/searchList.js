var searchCardsTemplate;
var organizations;

/* 
* When the page loads, fetch initial organization data and render it
* in cards on the list.
*/
window.onload = function() {
  searchCardsTemplate = document.getElementById('search-cards-template').innerHTML;
  fetchOrganizations("all").then(initalOrganizations => {
    render(initalOrganizations);
  })
}

/* 
* Fetches the organization data with the given filters from the server.
*/
function fetchOrganizations(filterText) {
  return fetch("/discover", {
    method: 'POST',
    body: JSON.stringify({filter: filterText})
  }).then(data => data.json());
}

/* 
* Renders the organization data into cards using the searchCard partial.
*/
function render(organizationsToRender) {
  const renderSearchCards = Handlebars.compile(searchCardsTemplate);
  document.getElementById('search-list').innerHTML = renderSearchCards({organizations: organizationsToRender});
}
