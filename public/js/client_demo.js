console.log('Hello from client_demo.js');

let catTemplate;
let listTemplate;
window.onload = function() {
  console.log('Initializing templates...');
  catTemplate = document.getElementById('cats-template').innerHTML;
  listTemplate = document.getElementById('list-template').innerHTML;
}

const myCats = [
  {
    name: 'Fiona',
    age: 4,
    photo_url: 'https://images.pexels.com/photos/104827/cat-pet-animal-domestic-104827.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
  },
  {
    name: 'Taco',
    age: 2,
    photo_url: 'https://cdn.pixabay.com/photo/2017/02/20/18/03/cat-2083492_960_720.jpg'
  }
];

const myTextList = ['element 1', 'element 2', 'element 3'];

function render() {
  console.log('Rendering on client...');
  const renderCats = Handlebars.compile(catTemplate);
  document.getElementById('cat-container').innerHTML = renderCats({cats: myCats});
  const renderList = Handlebars.compile(listTemplate);
  document.getElementById('list-container').innerHTML = renderList({listElements: myTextList});
}
