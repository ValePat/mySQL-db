// src/app.js
const express = require('express');
const morgan = require('morgan');
const authRoute = require('./routes/authRoutes');
const jobsRoute = require('./routes/jobsRoutes');
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

app.get('/', (req, res) => {
  res.send('Welcome to React Jobs');
});

app.use('/auth', authRoute);

app.use('/jobs', jobsRoute)

module.exports = app;
