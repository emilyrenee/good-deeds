var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    interests: {
      type: Array,
      required: true,
      trim: true
    },
    skills: {
      type: Array,
      required: true,
      trim: true
    },
    extras: {
      type: String,
      required: true,
      trim: true
    },
});
var User = mongoose.model('User', UserSchema);
module.exports = User;
