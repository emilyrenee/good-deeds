'use strict';

const express = require('express');
const router = express.Router();
const User = require('./models/user');
const path = require('path');
//reference with mid.loggedOut
const mid = require('./middleware');


// SIGN UP
router.get('/signup', mid.loggedOut, function(req,res, next){
  return res.render('signup', { title: 'Sign Up'});
});

// volunteer user sign-up
router.post('/signup', function(req, res, next) {
	//require fields
	if (req.body.firstName &&
    req.body.firstName &&
    req.body.email &&
    req.body.password &&
    req.body.confirmPassword
	) {
		// confirm user typed same password twice
		if (req.body.password !== req.body.confirmPassword) {
			var err = new Error('Passwords do not match.');
			err.status = 400;
			return next(err);
		}
		console.log(req.body);
		// create object and new document for db
		var userData = {
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			password: req.body.password,
			interestsList: req.body.interestsList
		};

		// use schema's `create` method to insert document into Mongo
		User.create(userData, function (error, user) {
			if (error) {
					return next(error);
			} else {
					req.session.userId = user._id;
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

// PROFILE

// volunteer user GET profile
router.get('/profile/:id', mid.requiresSignin, function (req, res, next) {
    //capture user id
    User.findById(req.params.id)
        .exec(function (error, user) {
            if (error) {
                return next(error);
            } else {
                //data display on profile
                return res.render('profile', {
										name: user.firstName + ' ' + user.lastName,
										email: user.email,
										url: '/profile/' + user._id,
										user_id: user._id,
										userId: req.session.userId || null,
										// interestsList: user.interestsList.interests
								});
            }
        });
});

// volunteer user update profile 
router.put('/profile/:id', mid.requiresSignin, function(req, res) {
	// capture id from the session?
	var id = req.session.userId;

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
		//save data to db (update email)
		user.save(function(err, updatedUser) {
			if (err) {
				return res.status(500).json({err: err.message});
			}

			//redirect to updated profile
			return res.json('ok')
		});
	});
});

// volunteer user DELETE profile
router.delete('/profile/:id', mid.requiresSignin, function(req, res, next) {
    var id = req.session.userId;

    //check id from session to authorize profile
    if (id !== req.params.id) {
        return res.status(500).json({err: "Ids don't match!"});
    }

    //delete User
    User.findByIdAndRemove(id, function(err, user) {
    	if(err) {
    		console.log('error removing user in route');
        return res.status(500).json("error removing user");
			}
      return res.status(200).json("OK");
    });
});

// SIGN-IN
router.get('/signin', mid.loggedOut, function(req,res){
  res.render('signin');
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
				return res.redirect('/profile/' + user._id);
			}
		});

	} else {
		var err = new Error('Email and password are required.');
		err.status = 401;
		return next(err);
	}
});

// SIGN OUT

// volunteer user GET sign-out
router.get('/signout', function(req, res, next) {
	if (req.session) {
		// delete session object
		req.session.destroy(function(err) {
			if(err) {
				return next(err);
			}
			return res.redirect('/');
			});
	}
});

// GET /
router.get('/', function(req, res, next) {
  return res.render('index', { title: 'Home', userId: req.session.userId || null });
});

// GET /about
router.get('/about', function(req, res, next) {
  return res.render('about', { title: 'About', userId: req.session.userId || null });
});

// GET /contact
router.get('/contact', function(req, res, next) {
  return res.render('contact', { title: 'Contact', userId: req.session.userId || null });
});

module.exports = router;
