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
    }).select('email password').exec(function(err, user) {

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
            email: user.email
          }, superSecret, {
            expiresInMinutes: 43200 // expires in 30 days
          });

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
    console.log(user[0].lists);
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

function update(req,res,next)
{
  User.find({},function(err,user){
    if (err) { console.log(err); }
    req.body.forEach(function(activity){
//      console.log("aid is " + activity.activityId)
      // record can come in with or without an activityId.
      // if it doesn't have an acivityId, conver the _id to activityId
      // if a record already has an activityId then do nothing
      if (activity.activityId === undefined)
      {
//        console.log("changing id for " + activity.title)
        activity.activityId = activity._id;
        delete activity._id;
      }
      else
      {
//        console.log("not changing id for " + activity.title)
      }
    })
    var idx = req.params.id;
    user[0].lists[idx].activity = req.body;
    user[0].save(function(err,u){
      console.log(err)
      res.json(u);
    });
  });
}

function destroyActivity(req,res,next)
{
  id = req.params.id;
  User.find({"lists.activity._id":id}, function(err, user){
    // HAVE TO LOOP OVER EVERY LIST TO FIND THE ONE WITH THE RIGHT ID
    user[0].lists.forEach(function(list){
      if (list.activity.id(id) !== null)
      {
        list.activity.id(id).remove();
        user[0].save();
        res.json(JSON.stringify(id));
      }
    })
  });
}

function destroyList(req,res,next)
{
  id = req.params.id;
  console.log("in destroy list..." + id);
  User.find({"lists._id":id}, function(err, user){
    // HAVE TO LOOP OVER EVERY LIST TO FIND THE ONE WITH THE RIGHT ID
    user[0].lists.id(id).remove();
    user[0].save();
    res.json(id);
  });
}

module.exports = {
  index: index,
  show: show,
  update: update,
  destroyActivity: destroyActivity,
  destroyList: destroyList,
  userAuth:     userAuth,
  tokenVerify:  tokenVerify
};
