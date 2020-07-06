const {Firestore} = require('@google-cloud/firestore');

// Database Initialization
const firestore = new Firestore();

exports.view = function(req, res) {
    createMovies();
    const movies = readMovies();
    movies.then((data) => {
        res.send(data);
    })
};

async function createMovies() {
    // Dummy data to insert into the database
    const movieData = [
        {
            title: "Black Panther",
            year: 2018,
        },
        {
            title: "Avengers: Endgame",
            year: 2019,
        },
        {
            title: "Iron Man",
            year: 2008,
        }
    ];

    movieData.forEach((movie) => {
        let document = firestore.collection('movies').doc();
        document.set(movie);
    });
}

// Read all documents in the 'movies' collection
async function readMovies() {
    let movieList = [];
    const moviesRef = firestore.collection('movies');
    const snapshot = await moviesRef.get();
    snapshot.forEach((movie) => {
        movieList.push(movie.data());
    });
    return movieList;
}

async function deleteAllMovies() {
    let movieList = [];
    const moviesRef = firestore.collection('movies');
    const snapshot = await moviesRef.get();
    snapshot.forEach((movie) => {
        movie.ref.delete();
    });
}
