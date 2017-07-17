'use strict';

const express = require('express');
const adminRouter = require('./admin_router');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
// ????? 
const path = require('path');
const app = express();

//use sessions for tracking logins
app.use(session({
	secret: 'javascript is awesome',
	resave: true,
	saveUninitialized: false
}));

// make User Id avaiable to templates
app.use(function (req, res, next) {
  //locals add info (custom var) to res object
    //views have access to locals
  res.locals.currentUser = req.session.userId;
  next();
});


// connect to mongodb on this machine to create db when app started
mongoose.connect("mongodb://localhost:27017/gooddeeds");
var db = mongoose.connection;
// mongo error
db.on('error', console.error.bind(console, 'connection error:'));

// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json 
app.use(bodyParser.json());

//serve static files
app.use(express.static('public'))
app.get('/signin',function(req,res){
  res.sendFile('signin.html', {root: 'public'});
});
app.get('/profile',function(req,res){
  res.sendFile('profile.html', {root: 'public'});
});

// view engine setup for pug
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.get('/signup',function(req,res){
  res.render('signup');
});

//include routes
const router = require('./router');
app.use('/', router);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler: next(err);
// define as the last app.use callback
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  //used treehouse's pug template
    //need to customize
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(3000, function() {
	console.log("The server is running on port 3000");
});
