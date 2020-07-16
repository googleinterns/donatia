const organizationInfoTemplate =
`
<h1>{{organization.name}}</h1>
<div id="contact-section"> 
  <p><ion-icon name="map-outline"></ion-icon> 12345 Road Drive, Houston, TX 77007</p>
  <p><ion-icon name="call-outline"></ion-icon>{{organization.phone}}</p>
  <p><ion-icon name="globe-outline"></ion-icon>{{organization.website}}</p>
  <p><ion-icon name="mail-outline"></ion-icon>{{organization.email}}</p>
</div>
<div id="description">{{organization.description}}</div>
`;

const acceptedCategoryCardTemplate = 
`
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


const sampleOrg = {
  name: 'Sample Org',
  description: 'Description of such and such.',
  email: 'info@sampleorg.org',
  phone: 7138429771,
  website: 'sampleorg.org',
}

const sampleAcceptedCategories = {
  "1":
  {
  "qualityGuidelines":[
    "No tears",
    "No deep cuts and scratches",
    "No stains that are note suppose to be there",
    "No holes",
    "No missing parts",
    "No fire damage",
    "No water damage",
    "No pet dander or fur",
    "No \"Home repairs\"",
    "Gently used"
  ],
  "instructions":[
    "Dop off your donation for free at our location",
    "Schedule a pickup of your donation on our website "
  ],
  "category":{
    "_path":{
      "segments":[
        "dev-Categories",
        "furniture"
      ]
    }
  } 
}
};

window.onload = function () {
  loadOrganizationInfo()
  loadAcceptedCategories();
};

export function loadOrganizationInfo() {
  const renderOrgInfo = Handlebars.compile(organizationInfoTemplate);

  fetch('http://localhost:3000/data/organizations/ZPPVSkSas3SXGcywo5aU')
  .then(response => response.json())
  .then(data => {
    console.log(data);
  });
  document.getElementById("info-section").innerHTML = renderOrgInfo({organization: sampleOrg});
}

export function loadAcceptedCategories() {
  const renderAcceptedCategories = Handlebars.compile(acceptedCategoryCardTemplate);

  fetch('http://localhost:3000/data/acceptedcategories/organization/ZPPVSkSas3SXGcywo5aU')
  .then(response => response.json())
  .then(data => {
    document.getElementById("categories-section").innerHTML = renderAcceptedCategories({acceptedCategories: data});
  });
 
 
}
