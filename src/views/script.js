$(document).ready(function () {
	$.ajax({
		url: "https://api.twitter.com/1.1/search/tweets.json?q=%23GoT&src=tyah"
		type: "GET",
		dataType: "json",
		cache: false
		crossDomain: true,
		scriptCharset: "utf-8",
		contentType: "application/json; charset=utf-8",
		success: function (data) {
			// log data
			console.log(data);
			// store data in jsonline format
		},
		error: function (err) {
			// log error
			console.log(err);
		},
		beforeSend: setHeader
		// needed to set access token
	});
});

function setHeader() {
	
}


// add in READme need your own app-only authenication
// this is my first time using twitter api and for illustrating my experience, I chose to preform this task in the simplest way possbile 
// run js file with the ajax
	// write to file
	// that script will print the data to new file (data.json) 

//created 2 variables and a named function to pass into the getJSON function
$(document).ready(function () {
	var flickrAPI = "https://api.flickr.com/services/feeds/photos_public.gne?format=jsoncallback=?";
	var flickrOptions = {
		tags: cat,
		format: "json"
	}
	function showCats(data) {
		print(data);
	}
	$.getJSON(flickrAPI, flickrOptions, showCats);
}
