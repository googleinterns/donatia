/**
 * TODO: GET organization's information from database
 * @param {string} id Organization's unique database ID
 * @return JSON of organization's information 
 */
function getFormInfo(id) {
  const info = {
    "ID": "google1",
    "name": "Google",
    "placesID": "12345 Road Drive",
    "description": "a great place to find non profits!",
    "phone": "1234567890",
    "email": "org@google.com",
    "websiteURL": "google.com",
  }
  return info;
}

/**
 * Populates the input elements of the form.
 * Removes disabled attribute if on edit page
 */
window.onload = async function populateForm() {
  const formJSON = await getFormInfo("{{id}}");
  document.getElementById("organization-name").value = formJSON.name;
  document.getElementById("organization-description").value = formJSON.description;
  document.getElementById("organization-address").value = formJSON.placesID;
  document.getElementById("organization-phone").value = formJSON.phone;
  document.getElementById("organization-website").value = formJSON.websiteURL;
  document.getElementById("organization-email").value = formJSON.email;
}
