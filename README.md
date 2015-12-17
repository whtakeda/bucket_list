# Bucket List
### Been there, done that


#About
Are you constantly making lists to keep track of your to-dos?  Do you need
5 different apps and calendars to track your appointments and errands?  Well this
won't help you in that area.

However, if you've ever made a New Year's resolution or said to yourself "Hey I
want to do such-and-such thing someday" then Bucket List is the app for you.

It allows you to track long-term goals and store them where they won't get lost
in a pile of papers or accidentally deleted when you get rid of that app you
were using.  Whether it's as ambitious as visitng all 50 states or as easy as 
trying all 31 flavors at Baskin Robbins, you can easily manage your goals and
track your progress in your quest to complete your bucket list.

# Installation
Mongolab setup
npm package dependencies

# Technologies
HTML
CSS
BootStrap
jQuery
Node
Express
Angular
MongoDB

# API

GET /activities
GET /activities/:id
PUT /activities/:id
POST/activities

GET /lists
GET /lists/:listid/activity/:activityid
PUT /lists/:id
PUT /lists/activity/:id
DELETE /lists/:id
POST /lists

POST /login
GET /users/:id


# Data Models
 new mongoose.Schema({
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
  password: String,
  googleId: String,
  email: String,
  lists: [
    listSchema
  ]
});

var activitySchema = new mongoose.Schema({
  user_id: String,
  title: String,
  description: String,
  rating: {type: Number, default: 0},
  location: String,
  cost: String,
  duration: String,
  tags: [tagSchema]
});
