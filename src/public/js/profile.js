'use strict';

// toggle the edit form
function toggleEditForm () {
  $( "#formEdit" ).toggle( 'slow' );
  $('#updateBtn').hide();
};

// click edit btn to toggle edit form
$( document ).ready( function() {
  $( "#updateBtn" ).click(toggleEditForm);
});
// cancel update and toggle form
$(".cancelUpdate").click(toggleEditForm);

//submit updated email
$(".submitUpdate").click( function(e) {
  e.preventDefault();
  // capture user id from the url /profile/id
  var id = e.target.value;
  // set the url for AJAX to /profile/id
  var url = 'http://localhost:3000/profile/' + id;
  //send PUT request to /profile/:id
  $.ajax({
    url: url,
    type: 'PUT',
    data: {
      //updated emailed entered by user
      newEmail: $('.newEmailInput').val(),
      //updated password entered by user
      password: $('.passwordInput').val(),
    },
    success: function() {
      alert("Account Updated.");
    },
    error: function (e) {
      console.log('error');
      console.log(e);
    }
  }).then(function(){
    console.log('and then');
    // refresh page to display updated data
    location.reload();
  });
});

//delete account
$( "#deleteBtn" ).click( function(e) {
  e.preventDefault();
  // capture user id from the url /profile/id
   var id = e.target.value;
  // set the url for AJAX to /profile/id
   var url = 'http://localhost:3000/profile/' + id;
   //user confirm delete before deactivation
  if (confirm("Are you sure you want to deactivate your account?")) {
    //send DELETE request to /profile/:id
    $.ajax({
      url: url,
      type: 'DELETE',
      success: function() {
        alert("Account Deactivated!");
      },
      error: function (e) {
        console.log('error');
        console.log(e);
      }
      //log out deactivated user
    }).then(function(){
      console.log('and then');
      window.location.replace('/signout');
    });
  } else {
    //user didn't confirm  to delete
    //refresh profile
    window.location.reload();
  }
});
