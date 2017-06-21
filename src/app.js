'use strict';

const express = require('express');
const router = require('./router');
const adminRouter = require('./admin_router');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json 
app.use(bodyParser.json());


app.use('/', express.static('public'));
app.use('/', router);
app.use('/admin', adminRouter);

app.listen(3000, function() {
	console.log("The server is running on port 3000");
});
