'use strict';
const axios = require('axios');

let cache = {};

// TODO: create a key to store data
// TODO: if the thing exists AND within a valid timeframe, send data from cache
// TODO: if thing doesn't exist - call API and cache return from API

async function getWeather(request, response, next) {
  try {
    let lon = request.query.lon;
    let lat = request.query.lat;

    let key = `${lat}${lon}-Weather`; // key = seattle-Weather

    if (cache[key] && (Date.now() - cache[key].timestamp) < 8.64e+7) { // pull key from cache object, valid timeframe, time now minus time it went in. If it's one day or more old, pull new api data hit.
      console.log('Weather cache was hit', cache);

      response.status(200).send(cache[key].data); // send data from cache

    } else {

      console.log('No items in cache');

      let url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}&days=5&units=I`;

      let weatherResults = await axios.get(url);

      let forecastToSend = weatherResults.data.data.map(cityForecast => {
        return new Forecast(cityForecast);
      });

      // Build it into cache
      cache[key] = {
        data: forecastToSend,
        timestamp: Date.now()
      };

      response.status(200).send(forecastToSend);

    }

  } catch (error) {
    next(error);
  }
}

class Forecast {
  constructor(weatherObj) {
    this.name = weatherObj.name;
    this.lon = weatherObj.lon;
    this.lat = weatherObj.lat;
    this.date = weatherObj.valid_date;
    this.description = weatherObj.weather.description;
  }
}

module.exports = getWeather;
