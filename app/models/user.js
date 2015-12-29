var mongoose = require('mongoose'),
    debug    = require('debug')('app:models');
var bcrypt      = require('bcrypt-nodejs');

var listSchema = new mongoose.Schema({
  name: String,
  visible: {type:Boolean, default:true},
  rating: {type:Number, default:0},
  activity: [{
    activityId: String,
    title: String,      // TODO: pull this out later after testing
    order: Number,
    completed: {type:Boolean, default:false},
    accepted: {type:Boolean, default:true},
    progress: {type:Number, default:0},
    location: {type:String, default:""},
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


// hash the password before the user is saved
userSchema.pre('save', function(next) {
  var user = this;

  // hash the password only if the password has been changed or user is new
  if (!user.isModified('password')) return next();

  // generate the hash
  bcrypt.hash(user.password, null, null, function(err, hash) {
    if (err) return next(err);

    // change the password to the hashed version
    user.password = hash;
    next();
  });
});

// method to compare a given password with the database hash
userSchema.methods.comparePassword = function(password) {
  var user = this;

  return bcrypt.compareSync(password, user.password);
};

var User = mongoose.model('User', userSchema);

module.exports = User;
