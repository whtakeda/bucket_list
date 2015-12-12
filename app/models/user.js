var mongoose = require('mongoose'),
    debug    = require('debug')('app:models');

var tagSchema = new mongoose.Schema({
  tag_name: String,
  created: { type: Date, default: Date.now }
});

var listSchema = new mongoose.Schema({
  order: Number,
  completed: Boolean,
  visible: Boolean,
  accepted: Boolean,
  progress: {type:Number, default:0}
  rating: {type:Number, default:0}
  location: [Number,Number]
});

var userSchema = new mongoose.Schema({
  name:   String,
  googleId: String,
  email: String,
  lists: [
    name: String,
    list: listSchema
  ]
});

var User = mongoose.model('User', userSchema);

module.exports = User;

users.js
