const categories = [
  'canned food',
  'produce',
  'cleaning supplies',
  'blankets',
  'clothes',
  'pet food',
  'plastic bags',
  'books',
  'school supplies',
  "children's toys",
  'hair products',
  'deoderant',
  'soap',
  'bottled drinks',
  'computers',
  'cars',
];

const categoryTrie = new Trie(categories);

/**
 * Gives autocomplete suggestions for item categories.
 * @param {string} input The prefix to base autocomplete suggestions on.
 * @return {array} The list of autocomplete suggestions.
 */
window.getAutocompleteCategories = function getAutocompleteCategories(input) {
  return categoryTrie.autocomplete(input);
};

/**
 * The individual nodes that make up the Trie.
 */
class TrieNode {
  /**
   * Creates a node storing the given prefix.
   * @param {string} prefix The string value at this node.
   */
  constructor(prefix = '') {
    this.children = {};
    this.isWord = false;
    this.prefix = prefix;
  }
}

/**
 * A 26-ary tree for storing word prefixes and searching words.
 */
class Trie {
  /**
   * Creates a Trie based on the given words.
   * @param {array} words The list of words to build the Trie with.
   */
  constructor(words) {
    this.root = new TrieNode('');
    for (const word of words) this.insert(word);
  }

  /**
   * Removes special characters from a string.
   * @param {string} input The raw string that may include special characters.
   * @return {string} The string stripped of special characters.
   */
  clean(input) {
    return input.toLowerCase().replace(/[^a-zA-Z ]/g, ' ');
  }

  /**
   * Adds the word to the Trie, creating new nodes for its prefixes if needed.
   * @param {string} word The word to insert into the tree.
   */
  insert(word) {
    word = this.clean(word);
    let currentNode = this.root;

    // Iterate down the tree for each character in the word.
    for (let level = 0; level < word.length; level++) {
      const index = word.charCodeAt(level) - 97;

      // Insert the node for that prefix into the trie if it doesn't exist.
      if (!currentNode.children[index]) {
        currentNode.children[index] = new TrieNode(word.substring(0, level + 1));
      }
      currentNode = currentNode.children[index];
    }
    currentNode.isWord = true;
  }

  /**
   * Gets the node containing the given prefix.
   * @param {string} prefix The prefix to find autcomplete suggestions for.
   * @return {array} The list of autocomplete suggestions.
   */
  find(prefix) {
    prefix = this.clean(prefix);
    let currentNode = this.root;

    // Get the prefix's node in the tree.
    for (let level = 0; level < prefix.length; level++) {
      // Store the ascii value of a character or, if it's a space, set index to 26.
      const index = prefix.charAt(index) === ' ' ? prefix.charCodeAt(level) - 97 : 26;

      if (currentNode.children[index]) {
        currentNode = currentNode.children[index];
      } else {
        // If the prefix isn't in the tree, return no suggestions.
        return [];
      }
    }
    return currentNode;
  }

  /**
   * Gets all complete words in a subtree originating from node.
   * @param {TrieNode} node The node used to look at words beneath.
   * @return {array} The the complete words in the Trie under node.
   */
  getChildWords(node) {
    let words = [];

    if (node.isWord) words.push(node.prefix);

    for (let key = 0; key < node.children.length; key++) {
      const childWords = this.getChildWords(node.children[key]);
      words = words.concat(childWords);
    }

    return words;
  }
}
