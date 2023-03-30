'use strict';
const axios = require('axios');

let cache = {};

// TODO: create a key to store data
// TODO: if the thing exists AND within a valid timeframe, send data from cache
// TODO: if thing doesn't exist - call API and cache return from API

async function getMovies(request, response, next) {
  try {

    let keywordFromFrontEnd = request.query.city_name;

    let key = `${keywordFromFrontEnd}- Movie`;

    if (cache[key] && (Date.now() - cache[key].timestamp) < 8.64e+7) {
      console.log('Movie cache was hit', cache);

      response.status(200).send(cache[key].data);

    } else {
      console.log('No items in movie cache');

      let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${keywordFromFrontEnd}`;

      let movieResults = await axios.get(url);

      let moviesToSend = movieResults.data.results.map(movie => new Movie(movie));


      // Build it into cache
      cache[key] = {
        data: moviesToSend,
        timestamp: Date.now()
      }


      response.status(200).send(moviesToSend);
    };

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
