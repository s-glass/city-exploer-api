'use strict';

console.log('Yay, first server :) ');

// Requires at the top of the page, like import but backend

const express = require('express');
require('dotenv').config();
const cors = require('cors');

let data = requires('./data/data.json');


// app will represent your server, bring in and then call express to create the server
const app = express();

// middleware sometimes goes here, for the endpoints, just use cors for now. Cors is the security guard that allows to share resources across the internet. won't change things locally but will when its on the cloud.
app.use(cors());

// port that the server will run on, designate a port
const PORT = process.env.PORT || 3002;

//method listen (comes with express), 2 arguments, calls server and says listen on this port

app.listen(PORT, ()=> console.log(`we are running on port ${PORT}`));

// add nodemon so it will auto render when you make changes to your server and don't have to close and open over and over

// Endpoints

// Base Endpoint - proof of life 
// 1st arg - string url in quotes
// 2nd arg - callback that will execute when that endpoint is hit
// callback takes in two parameters, request and reqponse - end point listens for request and sends back a response
// order matters - the wildcard serving as catch all is at the bottom and is the last point you define

app.get('/', (request, response) => {
  response.status(200).send('Welcome to my server!');
});

app.get('/hello', (request, response) => {
  console.log(request.query);
  let userFirstName = request.query.firstName;
  let userLastName = request.query.lastName;

  response.status(200).send(`Hello ${userFirstName} ${userLastName}! Welcome to Sarah's server!`);
  
});

// use express' middleware at the end

app.get('/pet', (request, response, next) => {
  try {
    let queriedSpecies = request.query.species;

    // let foundSpecies = data.find(pet => pet.species === queriedSpecies);
    let dataToGroom= data.find(pet => pet.species === queriedSpecies);
    let dataToGroom = new Pet(dataToGroom);

    // response.status(200).send(`Here's the found species: ${foundSpecies}`);
    response.status(200).send(dataToSend);
  } catch (error) {
    next(error);
  }
});

// class to groom the bulky data, class takes in object, grooms it down and pulls in the two things you need, in this case name and breed
class Pet{
  constructor(petObj){
    this.name = petObj.name;
    this.breed = petObj.breed;
  }
}



// catch all - at the bottom and serves as a 404 error message
app.get('*', (request, response) => {
  response.status(404).send('This route does not exist');
});

// the ? in the url is the query - whatever follows in that key value pair lives in the request query object. i.e. the key of firstName is stored as variable userFirstName. & looks for another query property of last name, so the value that comes in as lastName is stored, so that's how it renders to the page. The keys in the URL are in the request.query object. What you decide to store it in as a variable to take and use lateris up to you as the dev, not the user/API requester. However, the API requester needs to input firstName and lastName in the URL. 

// **** ERROR HANDLING - PLUG AND PLAY CODE FROM EXPRESS DOCS use = middleware****
app.use((error, request, response, next) => {
  response.status(500).send(error.message);
});