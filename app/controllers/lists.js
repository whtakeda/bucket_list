// Require resource's model(s).
// var User = require("../models/user");
var User = require("../models/user");
var Activity = require("../models/activity");
// var rp = require("request-promise");
// var env = require('../config/environment');
var _ = require("underscore");

function create(req,res,next)
{
  // TODO: have to actually find correct user once multiple users are added
  console.log("got here");
  User.find({},function(err,user){
    console.log(user[0].lists);
    user[0].lists.push(req.body)
    user[0].save();
  //   res.json(req.body);
  });
}

function index(req,res,next)
{
  Activity.find({},'title _id',function(err,activities){
    if (err) { console.log(err); }
    res.json(activities);
  });
}

module.exports = {
  create: create,
  index: index
};
