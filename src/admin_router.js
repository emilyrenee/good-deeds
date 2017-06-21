'use strict';

const express = require('express')
const volunteers = require('../mock/example.json')
const router = express.Router()

// Admin login
	// /admin POST

//Retun a listing of volunteers for admins to filter
	// /admin/volunteers
router.get('/volunteers', function(req, res) {
	res.json({
		response: "An admin sent me a GET request", volunteers
	});
	
});

module.exports = router
