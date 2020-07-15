/* global google*/

/**
 * @param {string} id Organization's unique database ID
 * @return {JSON} An organization's information
 */
function getFormInfo(id) {
  // TODO: Get organization's information from database
  const info = {
    ID: 'google1',
    name: 'Google',
    placesID: '12345 Road Drive',
    description: 'a great place to find non profits!',
    phone: '1234567890',
    email: 'org@google.com',
    websiteURL: 'google.com',
  };
  return info;
}

/*
 * Pre-populates the input elements of the form.
 */
window.onload = async function populateForm() {
  const formJSON = await getFormInfo('{{id}}');
  document.getElementById('organization-name').value = formJSON.name;
  document.getElementById('organization-description').value = formJSON.description;
  document.getElementById('organization-address').value = formJSON.placesID;
  document.getElementById('organization-phone').value = formJSON.phone;
  document.getElementById('organization-website').value = formJSON.websiteURL;
  document.getElementById('organization-email').value = formJSON.email;
};

/*
 * Adds Google Maps Places autocomplete to address input.
 */
window.initAutocomplete = function initAutocomplete() {
  const autocomplete = new google.maps.places.Autocomplete(
    document.getElementById('organization-address'),
    {types: ['address']}
  );
  autocomplete.setFields(['formatted_address']);
};
