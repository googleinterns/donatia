const {Firestore} = require('@google-cloud/firestore');

// Database Initialization
const firestore = new Firestore();
const DB_COLLECTION_NAME = process.env.NODE_ENV == 'production' ? 'movies' : 'dev-movies';

exports.view = function (req, res) {
  createMovies();
  const movies = readMovies();
  movies.then((data) => {
    res.send(data);
  });
};

/**
 * Inserts 3 new documents into the 'movies' collection with hard-coded data.
 */
async function createMovies() {
  // Dummy data to insert into the database
  const movieData = [
    {
      title: 'Black Panther',
      year: 2018,
    },
    {
      title: 'Avengers: Endgame',
      year: 2019,
    },
    {
      title: 'Iron Man',
      year: 2008,
    },
  ];

  movieData.forEach((movie) => {
    const document = firestore.collection(DB_COLLECTION_NAME).doc();
    document.set(movie);
  });
}

/**
 * Read all documents in the 'movies' collection
 */
async function readMovies() {
  const movieList = [];
  const moviesRef = firestore.collection(DB_COLLECTION_NAME);
  const snapshot = await moviesRef.get();
  snapshot.forEach((movie) => {
    movieList.push(movie.data());
  });
  return movieList;
}
