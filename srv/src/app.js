// src/app.js
const express = require('express');
const morgan = require('morgan');
const emailsRoute = require('./routes/routes');
const app = express();

app.use(morgan('dev'));
app.use(express.json());

// Endpoint di benvenuto o conferma
app.get('/', (req, res) => {
  res.send('Welcome to the Email Collector API');
});

// Log per verificare l'uso del router
console.log('Setting up /emails route');

app.use('/emails', emailsRoute);

module.exports = app;
