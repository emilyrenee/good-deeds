'use strict';
const express = require('express');
const router = express.Router();
const User = require('./models/user');
const path = require('path');


// volunteer user GETs profile
router.get('/profile/:id', function (req, res, next) {
	// console.log(req.session);
	console.log(req.session.userId, req.params.id);
	console.log(req.session.userId !== req.params.id);
	if (req.session.userId !== req.params.id) {
		var err = new Error("You are not authorized to view this page.");
		err.status = 403;
		return next(err);
	}
	//capture user id
	User.findById(req.params.id)   
	   .exec(function (error, user) {
		   if (error) {
	          return next(error);
	        } else {
	          console.log(user);	
	          console.log('Found user: ' + req.params.id);
	          console.log(res.locals.currentUser);
	          //data displayed on profile
	          return res.render('profile', 
	          	{ 
	          		name: user.firstName + ' ' + user.lastName,
	          		email: user.email,
	          		url: '/profile/' + user._id  
	          	});
	        }
    });  
});	   


// volunteer user sign-up
router.post('/signup', function(req, res, next) {
	//require fields
	if (req.body.firstName &&
    req.body.firstName &&
    req.body.email &&
    req.body.password &&
    req.body.confirmPassword) {

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
        		//create session?
          		req.session.userId = user._id;
          		console.log('user created' + user._id);
          		return res.redirect('/profile/' + user._id );
        	}
      	});

    } else {
      //user didn't fill out form correctly	
      var err = new Error('All fields required.');
      err.status = 400;
      return next(err);
    } 

});


// volunteer user update profile 
router.post('/profile/:id', function(req, res) {
	console.log("update profile here");
	//capture id from the session?
	var id = req.session.userId;
	// var user = req.body;
	var newEmail = req.body.newEmail;

  	//log new data from user imput
  	console.log(req.body);
  	console.log(req.session.userId, req.params.id);
	console.log(req.session.userId !== req.params.id);
  	//check id from session to authorize profile
	if (id !== req.params.id) {
	    return res.status(500).json({err: "Ids don't match!"});
	}

	//find user
    User.findById(id, function (err, user) {
    	//errors
		if (err) {
			return res.status(500).json({err: err.message});
		} else {
			user.email = req.body.newEmail || user.email;
			user.password = req.body.password;
		}
		//log the user
		console.log(User.id);
		//save data to db (update email)
		user.save(function(err, updatedUser) {
			if (err) {
				return res.status(500).json({err: err.message});
			}
          	return res.redirect('/profile/' + user._id );
			//render profile again 
			//with confirmation that email was updated
			//note - views can access locals object
		});
  		console.log('user updated');  	

	});
});

// volunteer user GET signin
router.get('/signin', function(req, res, next) {
	res.sendFile('/signin.html', {root: __dirname});
});

// volunteer user POST sign-in
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
          		console.log('user logged in: ' + user.firstName);
          		return res.redirect('/profile/' + user._id);
			}
		});

	} else {
		var err = new Error('Email and password are required.');
		err.status = 401;
		return next(err);
	}
});

// volunteer user GET sign-out
router.get('/signout', function(req, res, next) {
	if (req.session) {
		// delete session object
		req.session.destroy(function (err) {
		console.log('session destroyed');
			if(err) {
				return next(err);
			} else {
				return res.redirect('/');
				console.log('redirect');
			}
		});
	}
});

// volunteer user DELETE profile
router.delete('/profile/:id', function(req, res, next) {
	var id = req.session.userId;
  	console.log(req.params);
  	console.log(req.session.userId, req.params.id);
	//check id from session to authorize profile
	if (id !== req.params.id) {
	    return res.status(500).json({err: "Ids don't match!"});
	}
	//delete User
	User.findByIdAndRemove(id, function(err, user) {
		var response = {
			message: "User successfuly deactivated",
			id
		};
		console.log(response);
		return res.send(response);
	})
})


// admin user GET all profiles
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
