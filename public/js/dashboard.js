const formContent = [
  {
    humanName: 'Name',
    computerName: 'organization-name',
  },
  {
    humanName: 'Description',
    computerName: 'organization-description',
  },
  {
    humanName: 'Address',
    computerName: 'organization-address',
  },
  {
    humanName: 'Phone',
    computerName: 'organization-phone',
  },
  {
    humanName: 'Website',
    computerName: 'organization-website',
  },
  {
    humanName: 'Email',
    computerName: 'organization-email',
  },
];

window.onload = function() {
  let formTemplate = document.getElementById('form-template').innerHTML;
  const renderForm = Handlebars.compile(formTemplate);
  document.getElementById('form-container').innerHTML = renderForm({formcontent: formContent});
}
