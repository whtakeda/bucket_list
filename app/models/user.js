var mongoose = require('mongoose'),
    debug    = require('debug')('app:models');

var tagSchema = new mongoose.Schema({
  tag_name: String,
  created: { type: Date, default: Date.now }
});

var listSchema = new mongoose.Schema({
  name: String,
  visible: Boolean,
  rating: {type:Number, default:0},
  activity: [{
    activityId: String,
    title: String,      // TODO: pull this out later after testing
    order: Number,
    completed: Boolean,
    accepted: Boolean,
    progress: {type:Number, default:0},
    location: [Number,Number],
    reminderDate: Date
  }]
});

var userSchema = new mongoose.Schema({
  name: String,
  googleId: String,
  email: String,
  lists: [
    listSchema
  ]
});

var User = mongoose.model('User', userSchema);

module.exports = User;
