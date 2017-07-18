'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const MongoStore = require('connect-mongo')(session);
const app = express();

//in express, middleware is a function that has action to the request and response objects
  //custom middleware must call next()
//serve static files
// app.use('/', express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/public'));
// view engine setup for pug
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

// connect to mongodb on this machine to create db when app started
mongoose.connect("mongodb://localhost:27017/gooddeeds");
var db = mongoose.connection;
// mongo error
db.on('error', console.error.bind(console, 'connection error:'));

// use sessions for tracking login
app.use(session({
	secret: 'javascript is awesome',
	resave: true,
	saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

// make UserId available to templates
app.use(function (req, res, next) {
  //locals add info (custom var) to res object
    //views have access to locals
  res.locals.currentUser = req.session.userId;
  next();
});

// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json 
app.use(bodyParser.json());

//include routes
const router = require('./router');
app.use('/', router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// last callback
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(3000, function() {
	console.log("The server is running on port 3000");
});
