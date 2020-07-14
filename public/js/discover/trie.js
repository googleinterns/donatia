/* eslint-disable */ 

class TrieNode {
  constructor(prefix = '') {
    this.children = {};
    this.isWord = false;
    this.prefix = prefix;
  }
}

class Trie {
  constructor(words = undefined) {
    this.root = new TrieNode('');
    if (words) this.createTree(words);
  }

  createTree(words) {
    for(const word of words) this.insert(word);
  }

  insert(word) {
    word = word.toLowerCase();
    let currentNode = this.root;

    // Iterate down the tree for each character in the word.
    for (let level = 0; level < word.length; level++) {
      const index = word.charCodeAt(level) - 97;

      // Insert the node for that letter into the trie if it doesn't exist.
      if (!currentNode.children[index]) { 
        currentNode.children[index] = new TrieNode(word.substring(0, level + 1));
      }
      currentNode = currentNode.children[index];
    }
    currentNode.isWord = true; 
  }

  autocomplete(prefix) {
    prefix = prefix.toLowerCase();
    let currentNode = this.root;

    // Get the prefix's node in the tree.
    for (let level = 0; level < prefix.length; level++) {
      const index = prefix.charCodeAt(level) - 97;

      if (currentNode.children[index]) {
        currentNode = currentNode.children[index];
      } else {
        // If the prefix isn't in the tree, return no suggestions.
        return [];
      }
    }
    console.log("autcomplete node", currentNode)
    return this.getChildWords(currentNode);
  }

  getChildWords(parent) {
    let words = [];

    if (parent.isWord) words.push(parent.prefix);
    
    for (const key in parent.children) {
      const childWords = this.getChildWords(parent.children[key])
      words = words.concat(childWords)
    }
    return words;
  }
}

const testList = [
  'sin',
  'singh',
  'sign',
  'sinus',
  'sit',
  'silly',
  'side',
  'son',
  'soda',
  'sauce',
  'sand',
  'soap',
  'sar',
  'solo',
  'sour',
  'sun',
  'sure',
  'an',
  'ant',
  'aunt',
  'hell',
  'hello',
  'help',
  'helps',
  'hellish',
  ]

const wordTrie = new Trie(testList);
console.log("results for 'sin'", wordTrie.autocomplete("sin"));
