'use strict';
var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);

describe('Authentication', function(){
  it("New users can access sign up", function () {
    chai.request("http://localhost:3000")
      .get('/signup')
      .then(function(res){
        res.status.should.be.equal(400);
      })
  });
  it("Logged in users can't access sign up") {
    //if a session id exists should return Error message
    // function loggedOut(req, res, next)
    chai.request("http://localhost:3000")
      .get('/signup')
      .then(function(res){
        res.status.should.be.equal(500);
      })
  }
});

describe('User API Calls', function () {
  var test_id = 0;
  var test_first_name = "Test_First_Name";
  var test_last_name = "Test_Last_Name";
  var test_email = "Test_Email";
  var test_password = "Test_Password";
  var test_confirm_password = "Test_Confirm_Password";

  it("should require valid user input", function () {

    const userData = {
      firstName: test_first_name,
      lastName: test_last_name,
      email: test_email,
      password: test_password,
      confirmPassword: test_confirm_password
    };

    chai.request("http://localhost:3000")
      .post('/signup')
      .field('firstName', userData.firstName)
      .field('lastName', userData.lastName)
      .field('email', userData.email)
      .field('password', userData.password)
      .field('confirmPassword', userData.confirmPassword)
      .then(function (res) {
        //status ok
        res.status.should.be.equal(201);
        //is object
        res.body.should.be.type('object');
        //has required props
        res.body.should.have.property('firstName').eql(test_first_name);
        res.body.should.have.property('lastName').eql(test_last_name);
        res.body.should.have.property('email').eql(test_email);
        res.body.should.have.property('_id');
        //has a session
        res.body.should.have.property('session');
        //user was created
        res.body.should.have.property('user');

        test_id = res.body._id;  // Store ID of user for use by remaining tests
      }).catch(function(err) {
        console.log(err.message);
    });
  });
  // it("Should create a new User in db", function () {
  //   const User = req.body.user;
  //     res.body.should.have.property('user');
  // })

  // it("should not create a new user with invalid input", function () {
  //   const userData = {
  //     firstName: "",
  //     lastName: "",
  //     email: "",
  //     password: ""
  //   };
  //   chai.request("http://localhost:3000")
  //   .post('/signup')
  //   .field('firstName', userData.firstName)
  //   .field('lastName', userData.lastName)
  //   .field('email', userData.email)
  //   .field('password', userData.password)
  //   .field('confirmPassword', userData.confirmPassword)
  //   .then(function (res) {
  //     console.log(res.status);
  //     res.status.should.be.equal(400);
  //     res.body.should.have.property('err').eql('All fields required');
  //   }).catch(function(err) {
  //     console.log(err.message);
  //   });
  // });
});
