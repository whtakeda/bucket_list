var mongoose = require('mongoose'),
    debug    = require('debug')('app:models');

var tagSchema = new mongoose.Schema({
  tag_name: String,
  created: { type: Date, default: Date.now }
});

var activitySchema = new mongoose.Schema({
  user_id: String,
  name: String,
  description: String,
  rating: {type: Number, default: 0},
  location: String,
  cost: String,
  duration: String,
  tags: [tagSchema]
});

var Activity = mongoose.model('Activity', activitySchema);


module.exports = Activity;

