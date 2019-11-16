const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const userRoutes = require('./routes/users');
const gifRoutes = require('./routes/gifs');
const categoryRoutes = require('./routes/categories');
const articleRoutes = require('./routes/articles');
const commentRoutes = require('./routes/comments');
const feedRoutes = require('./routes/feed');
const agflagRoutes = require('./routes/agflags');

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
app.use('/api/v1/articles', articleRoutes);
app.use('/api/v1/comments', commentRoutes);
app.use('/api/v1/agflags', agflagRoutes);
app.use('/api/v1/gifs', gifRoutes);
app.use('/api/v1/feed', feedRoutes);
app.use('/gifs', express.static(path.join(__dirname, 'images')));

module.exports = app;
