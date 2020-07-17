/* global Trie Handlebars categories */

const categoryTrie = new Trie(categories);

const autocompleteOptionTemplate = `
      {{#each matches}}
        <div class="autocomplete-option" onclick="setValueOnClick('{{this}}')">
          {{this}}
        </div>
      {{/each}}
    `;

/**
 * Displays autocomplete options under the search box as the user types.
 * @param {string} input The text from the search box.
 */
window.showAutocompleteOptions = function (input) {
  if (input === '') {
    document.getElementById('autocomplete-list').innerHTML = '';
    return;
  }

  const prefixNode = categoryTrie.find(input);
  const matches = categoryTrie.getChildWords(prefixNode);

  // Render options on page.
  const renderCards = Handlebars.compile(autocompleteOptionTemplate);
  document.getElementById('autocomplete-list').innerHTML = renderCards({matches: matches});
};

/**
 * Sets the input value to the autocomplete option on select.
 * @param {string} value The autocomplete option to be selected.
 */
window.setValueOnClick = function (value) {
  document.getElementById('autocomplete-input').value = value;
  document.getElementById('autocomplete-list').innerHTML = '';
};
