// src/app.js
const express = require('express');
const morgan = require('morgan');
const emailsRoute = require('./routes/emails');
const authRoute = require('./routes/auth');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend domain
  credentials: true
}));

// Endpoint di benvenuto o conferma
app.get('/', (req, res) => {
  res.send('Welcome to the Email Collector API');
});

// Imposta route per /emails
app.use('/emails', emailsRoute);

// Imposta route per /emails
app.use('/auth', authRoute);

module.exports = app;
