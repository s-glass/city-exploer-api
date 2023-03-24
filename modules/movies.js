'use strict';
const axios = require('axios');

async function getMovies(request, response, next) {
  try {
    let keywordFromFrontEnd = request.query.city_name;

    let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${keywordFromFrontEnd}`;

    let movieResults = await axios.get(url);

    let moviesToSend = movieResults.data.results.map(movie => new Movie(movie));

    response.status(200).send(moviesToSend);
  } catch (error) {
    next(error);
  }
}

class Movie {
  constructor(movieObj) {
    this.title = movieObj.original_title;
    this.overview = movieObj.overview;
    this.image = movieObj.poster_path;
  }
}

module.exports = getMovies;
