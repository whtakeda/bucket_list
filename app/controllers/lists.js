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
  User.find({},function(err,user){
//    console.log(user[0].lists);
console.log(user);
    user[0].lists.push(req.body)
    user[0].lists.activity = [];
console.log(user);
    user[0].save(function(err){
      console.log(err);
    });
    res.json(req.body);
  });
}

function index(req,res,next)
{
  Activity.find({},'title _id',function(err,activities){
    if (err) { console.log(err); }
    res.json(activities);
  });
}

function getActivity(req,res,next)
{
  activityId = req.params.activityid;
  listId = req.params.listid;
  User.find({"lists.activity._id":activityId},function(err,activity){
    if (err) { console.log(err); }
    var list = activity[0].lists.filter(function(l){
      return l._id == listId
    })
    var activity = list[0].activity.filter(function(a){
      return a._id == activityId;
    })
    console.log(activity);
    res.json(activity);
  });
}

module.exports = {
  create: create,
  index: index,
  getActivity: getActivity
};
