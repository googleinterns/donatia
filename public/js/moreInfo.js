/* global Handlebars */

import {formatPhoneNumber} from '/static/js/global.js';

const organizationInfoTemplate = `
<h1>{{organization.name}}</h1>
<div id="contact-section"> 
  <a href="https://www.google.com/maps/dir/?api=1&destination={{organization.coordinates.lat}},{{organization.coordinates.lng}}"><ion-icon name="map-outline"></ion-icon>{{organization.address}}</a>
  <a href="tel:{{organization.phone}}"><ion-icon name="call-outline"></ion-icon>{{organization.phone}}</a>
  <a target="_blank" href="{{organization.website}}"><ion-icon name="globe-outline"></ion-icon>{{organization.website}}</a>
  <a href="mailto:{{organization.email}}"><ion-icon name="mail-outline"></ion-icon>{{organization.email}}</a>
</div>
<div id="description">{{organization.description}}</div>
`;

const acceptedCategoryCardTemplate = `
{{#each acceptedCategories}}
  <div class="card">
    <h2>{{formatCategory this.category._path.segments.[1]}}</h2>

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
  Handlebars.registerHelper('formatCategory', function (category) {
    let formatString = category.toLowerCase().replace(/[^a-zA-Z ]/g, ' ');
    formatString = formatString.charAt(0).toUpperCase() + formatString.slice(1);
    return formatString;
  });

  loadOrganizationInfo();
  loadAcceptedCategories();
};

/**
 * Fetch organization info and populate the template
 */
export function loadOrganizationInfo() {
  const renderOrgInfo = Handlebars.compile(organizationInfoTemplate);
  fetch(`/data/organizations/${organizationID}`)
    .then((response) => response.json())
    .then(async (data) => {
      data.phone = formatPhoneNumber(data.phone);
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
