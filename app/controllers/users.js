// Require resource's model(s).
var User = require("../models/user");
var Activity = require("../models/activity");
// var rp = require("request-promise");
// var env = require('../config/environment');
var _ = require("underscore");
var bcrypt      = require('bcrypt-nodejs');
var jwt = require("jsonwebtoken");
var env = require("../config/environment");
var superSecret = env.superSecret;
// superSecret = "afishcalledwanda";


//||||||||||||||||||||||||||--
// AUTHENTICATE USER
//||||||||||||||||||||||||||--
var userAuth = function (req, res, next) {
  // find the user
  User.findOne({
      email: req.body.email
    }).exec(function(err, user) {

      if (err) throw err;

      // no user with that phone number was found
      if (!user) {
        res.json({
          success: false,
          message: 'Authentication failed. User not found.'
        });
      } else if (user) {

        // check if password matches
        var validPassword = user.comparePassword(req.body.password);
        if (!validPassword) {
          res.json({
            success: false,
            message: 'Authentication failed. Wrong password.'
          });
        } else {

          // if user is found and password is right
          // create a token
          var token = jwt.sign({
            email: user.email,
            name: user.name,
            _id: user._id
          }, superSecret, {
            expiresIn: 43200 // expires in 30 days
          });
console.log("user is " + user)
          // return the information including token as JSON
          res.json({
            success: true,
            message: 'Enjoy your token!',
            token: token,
            user: user
          });
        }

      }

    });
  };

//||||||||||||||||||||||||||--
// VERIFIY TOKEN
//||||||||||||||||||||||||||--
var tokenVerify = function(req, res, next) {
  // do logging
  console.log('Somebody just accessed the Bucket List API!');

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
// console.log("1-"+req.body.token);
// console.log("2-"+req.query.token);
// console.log("3-"+req.headers['x-access-token']);
  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, superSecret, function(err, decoded) {

      if (err) {
        res.status(403).send({
          success: false,
          message: 'Failed to authenticate token.'
      });
      } else {
        // if everything is good, save to request for use in other routes
        console.log("successfully verified token");
        req.decoded = decoded;

        next(); // make sure we go to the next routes and don't stop here
      }
    });

  } else {

    // if there is no token
    // return an HTTP response of 403 (access forbidden) and an error message
    res.status(403).send({
      success: false,
      message: 'No token provided.'
    });

  }
};

/////////////////////////////

function index(req,res,next)
{

   // User.create([
   //    { // 0
   //      name: "Wayne",
   //      email: "whtakeda@gmail.com",
   //      password: "test"
   //    }],function(x,y){});

//  User.find({},'lists.activity.id lists.activity.title',function(err,l){
  User.find({},'lists',function(err,user){
    if (err) { console.log(err); }
//    console.log(user[0].lists);
    res.json(user[0].lists);
  });
}

function show(req,res,next)
{
//  User.find({},'lists.activity.id lists.activity.title',function(err,l){
  User.findById(req.params.id,function(err,user){
    if (err) { console.log(err); }
    res.json(user);
  });
}

module.exports = {
  index: index,
  show: show,
  userAuth:     userAuth,
  tokenVerify:  tokenVerify
};
