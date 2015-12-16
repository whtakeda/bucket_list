// Require resource's model(s).
var mongoose = require('mongoose');
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
//    console.log("User is " + user[0]);
//    console.log("req.body is " + JSON.stringify(req.body));
    var list = {
      name: req.body.name,
      visible: req.body.visible,
      rating: req.body.rating,
      activity: []
    };
    // list._id = mongoose.Types.ObjectId();
    user[0].lists.push(list);
//    user[0].lists.activity = [];
    user[0].save(function(err,data){
      console.log(err);
      res.json(user[0].lists.pop());
      // res.json(list);
    });
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
    });
    var activity = list[0].activity.filter(function(a){
      return a._id == activityId;
    });
//    console.log(activity);
    res.json(activity);
  });
}

function updateActivity(req,res,next)
{
  console.log("body is " + JSON.stringify(req.body));
  activityId = req.body.activityId;
  User.find({"lists.activity._id":activityId},function(err,activities){
//   console.log("activity is " + activities[0].lists);
    list = activities[0].lists.filter(function(l){
//      console.log("l is " + l);
      activity = l.activity.filter(function(a){
        return a._id == activityId
      });
      console.log("activity is" + activity + "!");
      if (activity != "")
      {
        console.log("a is " + Array.isArray(activity));
        activity[0].completed = req.body.completed;
        activity[0].accepted = req.body.accepted;
        activity[0].progress = req.body.progress;
        activity[0].location = req.body.location;
        console.log("a is " + activity[0]);
        console.log("a is " + activity[0].progress);
        console.log("b is " + req.body.progress);
        activities[0].save(function(err,u){console.log(err);});
      }
    });
                  //     var list = activities[0].lists.filter(function(l){
                  //       console.log(l._id);
                  // //      return l._id == "5670a54a3fa05c2a6bb0e463";
                  //       return l._id == "56708fbc4def68285f971611";

                  //     });
                  //     console.log("list is " + list);
                  //     var activity = list[0].activity.filter(function(a){
                  //       return a._id == activityId;
                  //     });
                  //     console.log("a is " + activity[0].progress);
                  //     activity.progress = 40;
                  //     activity.title = "Ice Cream!!!";
                  //     console.log("a is " + activity.progress);
                  //     console.log("a is " + activity.title);
                  //     console.log("a is " + activity);
                  //     res.json("Done");
  });
}

module.exports = {
  create: create,
  index: index,
  getActivity: getActivity,
  updateActivity: updateActivity
};
