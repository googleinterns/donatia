/* global google Handlebars */

/**
 * Gets the information of the organization assigned to the current user.
 * @return {JSON} An organization's information.
 */
async function getOrganizationInfo() {
  const memberData = await (await fetch('/data/member')).json();
  const organizationData = await (await fetch(`/data/organization/member/${memberData.id}`)).json();

  // Return undefined if the organization hasn't been approved yet.
  if (!organizationData.id) {
    return {orgID: undefined};
  }

  const orgInfo = await (await fetch(`/data/organizations/${organizationData.id}`)).json();
  return {...orgInfo, orgID: organizationData.id};
}

/**
 * Adds Google Maps Places autocomplete to address input.
 */
function initAutocomplete() {
  const addressInput = document.getElementById('address');
  const autocomplete = new google.maps.places.Autocomplete(addressInput);
  autocomplete.setFields(['place_id', 'geometry', 'name']);
  autocomplete.addListener('place_changed', function () {
    autocomplete.getPlace();
  });
}

const approvalMissingTemplate = `
  <div class="alert">
    Your account has not been activated.<br>
    Please visit 
    <a target="_blank" href="https://forms.gle/CoT6UXv7ppkJ42z98">
      https://forms.gle/CoT6UXv7ppkJ42z98
    </a>
    to request activation.
  </div>
`;

/*
 * Pre-populates the input elements of the form.
 */
window.onload = async function populateForm() {
  const formJSON = await getOrganizationInfo();

  if (!formJSON.orgID) {
    const renderApprovalAlert = Handlebars.compile(approvalMissingTemplate);
    document
      .getElementById(`form-container`)
      .insertAdjacentHTML('afterbegin', renderApprovalAlert());
    return;
  }

  document.getElementById('address').value = formJSON.address;
  document.getElementById('name').value = formJSON.name;
  document.getElementById('description').value = formJSON.description;
  document.getElementById('phone').value = formJSON.phone;
  document.getElementById('website').value = formJSON.website;
  document.getElementById('email').value = formJSON.email;
  document.getElementById('acceptsDropOff').checked = formJSON.acceptsDropOff;
  document.getElementById('acceptsPickUp').checked = formJSON.acceptsPickUp;
  document.getElementById('acceptsShipping').checked = formJSON.acceptsShipping;
  document.getElementById('org-info-form').action = `/data/organizations/${formJSON.orgID}`;
  initAutocomplete();
};
