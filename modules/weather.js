'use strict';
const axios = require('axios');

async function getWeather(request, response, next) {
  try {
    let lon = request.query.lon;
    let lat = request.query.lat;
    let url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}&days=5&units=I`;
    console.log(url);

    let weatherResults = await axios.get(url);

    let forecastToSend = weatherResults.data.data.map(cityForecast => {
      return new Forecast(cityForecast);
    });

    response.status(200).send(forecastToSend);
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
