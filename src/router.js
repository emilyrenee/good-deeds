'use strict';
const express = require('express');
const router = express.Router();
var User = require('./models/user');


//Volunteer user profile
router.get('/profile', function (req, res, next) {
	if (! req.session.userId ) {
		var err = new Error("You are not authorized to view this page.");
		err.status = 403;
		return next(err);
	}
	//capture user id
	console.log('here');
	User.findById(req.session.userId);   
	   exec(function (error, user) {
		   if (error) {
	          return next(error);
	        } else {
	          console.log('User redirected: ' + req.params.id);
			  res.sendFile('/profile.html', {root: __dirname});
			  res.json()
	          return res.json(user.firstName);
	        }
    });  
});	   


//Volunteers sign-up
router.post('/signup', function(req, res, next) {
	//require fields
	if (req.body.firstName &&
    req.body.firstName &&
    req.body.email &&
    req.body.password &&
    req.body.confirmPassword) {
		// log data
		console.log(req.body);
		console.log('data provided'); 

	    // confirm user typed same password twice
	    if (req.body.password !== req.body.confirmPassword) {
	        var err = new Error('Passwords do not match.');
	        err.status = 400;
	        return next(err);
	    }

	    // create object and new document for db
        var userData = {
        	firstName: req.body.firstName,
        	lastName: req.body.lastName,
        	email: req.body.email,
        	password: req.body.password
      	};

     	// use schema's `create` method to insert document into Mongo
      	User.create(userData, function (error, user) {
        	if (error) {
          	return next(error);
        	} else {
          	req.params.userId = user._id;
          	console.log('user created' + user._id);
          	return res.redirect('/profile');
        	}
      	});

    } else {
      //user didn't fill out form correctly	
      var err = new Error('All fields required.');
      err.status = 400;
      return next(err);
    } 

});


//Volunteer users update profile
router.put('/profile', function(req, res) {
	var id = req.params._id;
	var user = req.body;
	if (user && user._id !== id) {
	    return res.status(500).json({err: "Ids don't match!"});
	}

    User.findByIdAndUpdate(id, userData, function (err, user) {
		if (err) {
			return res.status(500).json({err: err.message});
		}
  		// req.session.userId = user._id;
  		console.log('user updated');
  		res.json({userData: userData, message: "User Updated"});
  //redirect to profile
  // return res.redirect('/profile');
  // console.log('user redirected');
});
	//log data sent
	console.log(req.body);

	// save data sent

	res.json({
		response: "A volunteer sent me a PUT request to /profile"
	})
})

router.get('/signin', function(req, res, next) {
	res.sendFile('/signin.html', {root: __dirname});
});

//Volunteer users to sign-in
router.post('/signin', function(req, res, next) {
	if (req.body.email && req.body.password) {
		//call the method we created
		User.authenticate(req.body.email, req.body.password, function (error, user) {
			//bad login
			if (error || !user) {
				var err = new Error('Wrong email or password.');
				err.status = 401;
				return next(err);
			} else {
				//get user._id back from authenticate function
				//user is our document
				req.session.userId = user._id;
				return res.redirect('/profile');
			}
		});

	} else {
		var err = new Error('Email and password are required.');
		err.status = 401;
		return next(err);
	}
});
	// POST /sign-in

	//redirect to /profile

//list all profiles
// router.get('/profiles', function(req, res, next){
// 	//list all profiles
// 	mongoose.model('User').find({}, function(err, users) {
// 		if (err) {
//       		console.log(err);
//       		return res.status(500).json(err);
//     }
//     res.send(users);
// });
// });	


module.exports = router;
