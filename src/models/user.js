'use strict'

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var InterestsSchema = new mongoose.Schema({
  animalWelfare: {
    type: Boolean
  },
  children: {
    type: Boolean
  },
  elderlyCare: {
    type: Boolean
  },
  environment: {
    type: Boolean
  },
  foodInsecurity: {
    type: Boolean
  }
});

//gives monoose information about the document we want to store
var UserSchema = new mongoose.Schema({
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    // need to use check-box(s) option as an array
    interestsList: {
      type: Array,
      ref: 'InterestSchema',
      required: false,
      // child: InterestsList,
      children: [InterestsSchema]
    }
    // need to use check-box option as an array
    // skillsList: {
    //   type: Array,
    //   required: mongoose.Schema.Types.ObjectId,
    //   ref: 'Skills',
    //   trim: false
    // }
});


//create the authenticate method 
// authenticate input against database documents
//statics allows us to apply methods directly to the model
UserSchema.statics.authenticate = function(email, password, callback) {
  //callback added in route
  //find doc with user's email
  User.findOne({ email: email })
    //preform search and process results
    .exec(function (error, user) {
      if (error) {
        return callback(error);
      } else if ( !user ) {
        var err = new Error('user not found.');
        err.status = 401;
        return callback(error);
      }
      //compare password input with users hashed password
      bcrypt.compare(password, user.password, function(error, result) {
        if (result === true) {
          return callback(null, user);
        } else {
          return callback();
        }
      })
    });
}

//hash password before user record is stored
UserSchema.pre('save', function(next) {
  //user object created with user data
  console.log('here!');
  var user = this;
  bcrypt.hash(user.password, 10, function(err, hash) {
    //callback replace plain text password with hashed one
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  });
});

const User = mongoose.model('User', UserSchema);
const Interests = mongoose.model('Interests', InterestsSchema);
module.exports = Interests;
module.exports = User;
