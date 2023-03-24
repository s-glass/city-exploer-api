'use strict';
console.log('Yay, first server ');

const express = require('express');
require('dotenv').config();
const cors = require('cors');
const getWeather = require('./modules/weather.js');
const getMovies = require('./modules/movies.js');

const app = express();

app.use(cors());

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => console.log(`we are running on port ${PORT}`));



app.get('/weather', getWeather);

app.get('/movies', getMovies);



app.get('*', (request, response) => {
  response.status(404).send('This route does not exist');
});

app.use((error, request, response, next) => {
  console.log('hey it did not work');
  response.status(500).send(error.message);
});
