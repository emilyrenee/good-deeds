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
	          		name: user.firstName + ' ' + user.lastName 
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
router.put('/profile', function(req, res) {
	console.log("update profile here");
	var id = req.params._id;
	var user = req.body;
	if (user && user._id !== id) {
	    return res.status(500).json({err: "Ids don't match!"});
	}

    User.findByIdAndUpdate(id, userData, function (err, user) {
		if (err) {
			return res.status(500).json({err: err.message});
		}
  		req.session.userId = user._id;
  		// save data sent
  		res.user.updateOne(req.body, function(err, result) {
  			if(err) return next(err);
  			res.json(result);
  		})
		//updateOne()
  		console.log('user updated');
  		res.json({userData: userData, message: "User Updated"});
});
	//log data sent
	console.log(req.body);

	

	res.json({
		response: "A volunteer sent me a PUT request to /profile"
	})
})

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
          		return res.redirect('/profile/' + user._id );
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
