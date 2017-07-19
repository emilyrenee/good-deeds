'use strict';
function toggleEditForm () {
  $( "#formEdit" ).toggle( 'slow' );
  $('#updateBtn').hide();
};

//click edit btn to display form
$( document ).ready( function() {
  $( "#updateBtn" ).click(toggleEditForm);
});
//cancel update
$(".cancelUpdate").click(toggleEditForm);

//submit updated email
$(".submitUpdate").click( function(e) {
  e.preventDefault();
  var id = e.target.value;
  //route
  var url = 'http://localhost:3000/profile/' + id;
  console.log("clicked to update ");
  // console.log(url);
  console.log($('.newEmailInput').val());
  console.log($('.passwordInput').val());
  //send PUT request to /profile/:id
  $.ajax({
    url: url,
    type: 'PUT',
    data: {
      newEmail: $('.newEmailInput').val(),
      password: $('.passwordInput').val(),
    },
    success: function() {
      console.log('success');
      alert("Account Updated.");
    },
    error: function (e) {
      console.log('error')
      console.log(e);
    }
  }).then(function(){
    console.log('and then');
    location.reload();
  });
});

//delete account
$( "#deleteBtn" ).click( function(e) {
  e.preventDefault();
   var id = e.target.value;
   var url = 'http://localhost:3000/profile/' + id;
   console.log("clicked to delete " + id);
   console.log(url);
   //user confirm delete before deactivation
  if (confirm("Are you sure you want to deactivate your account?")) {
    $.ajax({
      url: url,
      type: 'DELETE',
      success: function() {
        console.log('success');
      },
      error: function (e) {
        console.log('error');
        console.log(e);
      },
      complete: function() {
        alert("Account Deactivated!");
      }
      //log user out after deactivated
    }).then(function(){
      console.log('and then');
      window.location.replace('/signout');
    });
  } else {
    //user didn't confirm  to delete
    window.location.reload();
  }
});
