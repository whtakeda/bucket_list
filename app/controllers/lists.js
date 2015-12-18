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
  console.log("looking for" + req.body.id)
  // TODO: have to actually find correct user once multiple users are added
  User.findById(req.body.id,function(err,user){
//    console.log("User is " + user[0]);
//    console.log("req.body is " + JSON.stringify(req.body));
    var list = {
      name: req.body.list.name,
      visible: req.body.list.visible,
      rating: req.body.list.rating,
      activity: []
    };
    // list._id = mongoose.Types.ObjectId();
    user.lists.push(list);
//    user[0].lists.activity = [];
    user.save(function(err,data){
      console.log(err);
      res.json(user.lists.pop());
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
//  console.log("body is " + JSON.stringify(req.body));
  activityId = req.body.activityId;
  User.find({"lists.activity._id":activityId},function(err,activities){
//   console.log("activity is " + activities[0].lists);
    list = activities[0].lists.filter(function(l){
//      console.log("l is " + l);
      activity = l.activity.filter(function(a){
        return a._id == activityId
      });
//      console.log("activity is" + activity + "!");
      if (activity != "")
      {
        activity[0].completed = req.body.completed;
        activity[0].accepted = req.body.accepted;
        activity[0].progress = req.body.progress;
        activity[0].location = req.body.location;
        activities[0].save(function(err,u){
          console.log(err);
          res.json(activity[0]);
        });
      }
    });
  });
}

function destroy(req,res,next)
{
  id = req.params.id;
  User.find({"lists._id":id}, function(err, user){
    // HAVE TO LOOP OVER EVERY LIST TO FIND THE ONE WITH THE RIGHT ID
    user[0].lists.id(id).remove();
    user[0].save();
    res.json(id);
  });
}

function destroyActivity(req,res,next)
{
  console.log("deleting list activity " + req.params.id)
  id = req.params.id;
  User.find({"lists.activity._id":id}, function(err, user){
    console.log("found user " + user);
    if (err) { console.log(err); }
    // HAVE TO LOOP OVER EVERY LIST TO FIND THE ONE WITH THE RIGHT ID
    user[0].lists.forEach(function(list){
      if (list.activity.id(id) !== null)
      {
        list.activity.id(id).remove();
        user[0].save(function(err,data){
          res.json(id);
        });
      }
    })
  });
}


// stil in development - has serious bugs
// need to change the id parameter that gets passed in from a list index to an id in maincontroller
// function update(req,res,next)
// {
//   console.log("Looking for " + req.params.id)
//   User.find({"lists._id":req.params.id},function(err,user){
//     if (err) { console.log(err); }
//     console.log("found user " + user);
//     req.body.forEach(function(activity){
//       // record can come in with or without an activityId.
//       // if it doesn't have an activityId, convert the _id to activityId
//       // if a record already has an activityId then do nothing
//       if (activity.activityId === undefined)
//       {
//         activity.activityId = activity._id;
//         delete activity._id;
//       }
//     })
//     var idx = req.params.id;
// //    user[0].lists[idx].activity = req.body;
//     user[0].lists.forEach(function(list){
//       if (list._id = req.params.id)
//       {
//         list.activity = req.body;
//       }
//     });
//     user[0].save(function(err,u){
//       console.log(err)
//       res.json(u);
//     });
//   });
// }

function update(req,res,next)
{
  console.log("index is " + req.params.id)
  User.find({},function(err,user){
    if (err) { console.log(err); }
    console.log(user);
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


module.exports = {
  create: create,
  index: index,
  getActivity: getActivity,
  updateActivity: updateActivity,
  destroy: destroy,
  destroyActivity: destroyActivity,
  update: update
};
