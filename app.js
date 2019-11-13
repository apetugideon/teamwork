const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const userRoutes = require('./routes/users');
const gifRoutes = require('./routes/gifs');
const categoryRoutes = require('./routes/categories');

// const cookieParser = require('cookie-parser');
// const logger = require('morgan');
// const createError = require('http-errors');

const app = express();

app.use((request, response, next) => {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());

app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/gifs', gifRoutes);
app.use('/gifs', express.static(path.join(__dirname, 'images')));

module.exports = app;
