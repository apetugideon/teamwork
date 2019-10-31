const createError   = require('http-errors');
const express       = require('express');
const bodyParser    = require("body-parser");
const path          = require("path");
const cookieParser  = require('cookie-parser');
const logger        = require('morgan');

const userRoutes    = require('./routes/users');

/*
const employeeRoutes= require('./routes/employees');
const gifRoutes     = require('./routes/gifs');
const articleRoutes = require('./routes/articles');
const commentRoutes = require('./routes/comments');
const categoryRoutes= require('./routes/categories');
const flagRoutes    = require('./routes/flags');*/

const app = express();

app.use((request, response, next) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

app.use('/api/v1/auth', userRoutes);
//app.use('/images', express.static(path.join(__dirname, 'images')));

/*app.use('/api/v1/auth', userRoutes); 
app.use('/api/v1/employees', employeeRoutes); 
app.use('/api/v1/gifs', gifRoutes); 
app.use('/api/v1/articles', articleRoutes); 
app.use('/api/v1/comments', commentRoutes); 
app.use('/api/v1/categories', categoryRoutes); 
app.use('/api/v1/flags', flagRoutes);*/

module.exports = app;