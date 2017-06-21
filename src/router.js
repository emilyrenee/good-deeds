'use strict';

const express = require('express')
const profile = require('../mock/example.json')
const router = express.Router()


//Volunteers sign-up
router.post('/signup', function(req, res, next) {
	// log data sent
	console.log(req.body);

	// save data sent

	//display the data
	return res.send("Thanks for signing up!")
})

//Volunteer users update profile
router.put('/signup', function(req, res) {
	//log data sent
	console.log(req.body);

	// save data sent

	res.json({
		response: "A volunteer sent me a PUT request to /signup"
	})
})

//Volunteer users to sign-in
	// POST /sign-in


module.exports = router
