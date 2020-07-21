/**
 * Gets the information of the organization assigned to the current user.
 * @return {JSON} An organization's information.
 */
async function getOrganizationInfo() {
  const memberData = await (await fetch('/data/member')).json();
  const organizationData = await (await fetch(`/data/organization/member/${memberData.id}`)).json();
  const orgInfo = await (await fetch(`/data/organizations/${organizationData.id}`)).json();
  return {...orgInfo, orgID: organizationData.id};
}

/*
 * Pre-populates the input elements of the form.
 */
window.onload = async function populateForm() {
  const formJSON = await getOrganizationInfo();
  document.getElementById('name').value = formJSON.name;
  document.getElementById('description').value = formJSON.description;
  document.getElementById('address').value = formJSON.address;
  document.getElementById('phone').value = formJSON.phone;
  document.getElementById('website').value = formJSON.website;
  document.getElementById('email').value = formJSON.email;
  document.getElementById('acceptsDropOff').checked = formJSON.acceptsDropOff;
  document.getElementById('acceptsPickUp').checked = formJSON.acceptsPickUp;
  document.getElementById('acceptsShipping').checked = formJSON.acceptsShipping;
  document.getElementById('org-info-form').action = `/data/organizations/${formJSON.orgID}`;
};
