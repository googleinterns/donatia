/* global Handlebars */
/* global google*/

const organizationInfoTemplate = `
<h1>{{organization.name}}</h1>
<div id="contact-section"> 
  <a href="https://www.google.com/maps/dir/?api=1&destination={{organization.lat}},{{organization.lng}}&destination_place_id={{organization.placeID}}"><ion-icon name="map-outline"></ion-icon>{{organization.address}}</a>
  <a href="tel:{{organization.phone}}"><ion-icon name="call-outline"></ion-icon>{{organization.phone}}</a>
  <a href="{{organization.website}}"><ion-icon name="globe-outline"></ion-icon>{{organization.website}}</a>
  <a href="mailto:{{organization.email}}"><ion-icon name="mail-outline"></ion-icon>{{organization.email}}</a>
</div>
<div id="description">{{organization.description}}</div>
`;

const acceptedCategoryCardTemplate = `
{{#each acceptedCategories}}
  <div class="card">
    <h2>{{this.category._path.segments.[1]}}</h2>

    <h3>Quality Check</h3>
    <ul>
      {{#each this.qualityGuidelines}}
        <li>{{this}}</li>
      {{/each}}
    </ul>

    <h3>Instructions</h3>
    <ol>
      {{#each this.instructions}}
        <li>{{this}}</li>
      {{/each}}
    </ol>
  </div>
{{/each}}
`;

const locationURL = window.location.href.split('/');
const organizationID = locationURL[locationURL.length - 1];

window.onload = function () {
  loadOrganizationInfo();
  loadAcceptedCategories();
};

/**
 * Fetc organization info and populate the template
 */
export function loadOrganizationInfo() {
  const renderOrgInfo = Handlebars.compile(organizationInfoTemplate);
  fetch(`/data/organizations/${organizationID}`)
    .then((response) => response.json())
    .then(async (data) => {
      await setAddressFromPlaceID(data);
      document.getElementById('info-section').innerHTML = renderOrgInfo({organization: data});
    });
}

/**
 * Fetch the all accepted categories of organization and populate template
 */
export function loadAcceptedCategories() {
  const renderAcceptedCategories = Handlebars.compile(acceptedCategoryCardTemplate);
  fetch(`/data/acceptedcategories/organization/${organizationID}`)
    .then((response) => response.json())
    .then((data) => {
      document.getElementById('categories-section').innerHTML = renderAcceptedCategories({
        acceptedCategories: data,
      });
    });
}

/**
 * Set the address of the organization using its placeID
 * @param {*} organization
 * @return {Promise} promise object that resolves when address is retrieved or not found
 */
function setAddressFromPlaceID(organization) {
  const geocoder = new google.maps.Geocoder();
  return new Promise(function (resolve, reject) {
    geocoder.geocode({placeId: organization.placeID}, function (results, status) {
      if (status === 'OK') {
        if (results[0]) {
          organization.address = results[0].formatted_address;
          organization.lat = results[0].geometry.location.lat();
          organization.lng = results[0].geometry.location.lng();
        } else {
          console.log('No results found');
        }
      } else {
        console.log('Geocoder failed due to: ' + status);
      }
      resolve();
    });
  });
}
