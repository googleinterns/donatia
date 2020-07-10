const options = ["clothing", "furniture", "food"]

const autocompleteOptionTemplate = 
    `
      {{#each matches}}
        <div class="autocomplete-option" onclick="setValueOnClick('{{this}}')">
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

function setValueOnClick(value) {
  document.getElementById("autocomplete-input").value = value;
  document.getElementById("autocomplete-list").innerHTML = "";
}
