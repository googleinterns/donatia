const options = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua &amp; Barbuda","Argentina"]

const autocompleteOptionTemplate = 
    `
      {{#each matches}}
        <div class="autocomplete-option">
          {{this}}
        </div>
      {{/each}}
    `;

function showAutocompleteOptions(input) {
  if(input === "") {
    document.getElementById("autocomplete-list").innerHTML = "";
    return;
  }

  let matches = [];
  for (let option of options) {
    if (option.toLowerCase().includes(input.toLowerCase())) matches.push(option);
  }

  // Render options on page.
  const renderCards = Handlebars.compile(autocompleteOptionTemplate);
  document.getElementById("autocomplete-list").innerHTML = renderCards({matches: matches});
}
