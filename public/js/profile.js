'use strict';

(function () {
	console.log('here!!');
})();

//click edit to display form
$( document ).ready( function() {
  $( "#update" ).click( function() {
    $( "#form1" ).toggle( 'slow' );
  });
});
// need api get route that returns json
//write get that returns data 
// //hit route with AJAX call
// Using XMLHttpRequest / fetchto submit the form with the right http method.
// Use a hidden form field and some sort of middleware that rewrites the request on the server side based on the value of the hidden form field.
// That's pretty much it. Browsers don't support submitting forms with any method other than POST or GET.