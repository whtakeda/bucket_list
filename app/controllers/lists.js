// Require resource's model(s).
var mongoose = require('mongoose');
var User = require("../models/user");
var Activity = require("../models/activity");
var _ = require("underscore");

function create(req,res,next)
{
  // TODO: have to actually find correct user once multiple users are added
  User.findById(req.body.id,function(err,user){
    var list = {
      name: req.body.list.name,
      visible: req.body.list.visible,
      rating: req.body.list.rating,
      activity: []
    };
    user.lists.push(list);
    user.save(function(err,data){
      console.log(err);
      res.json(user.lists.pop());
    });
  });
}

function index(req,res,next)
{
  User.find({},'name _id lists',function(err,users){
    console.log(users);
    res.json(users)
  })
}

// function index(req,res,next)
// {
//   console.log("looking for user..." + req.params.id)
//   User.findById(req.params.id,function(err,user){
//     if (err) { console.log(err); }
//     console.log("found user..." + user)
//     res.json(activities);
//   });
// }

function show(req,res,next)
{
  res.json("done");
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
    res.json(activity);
  });
}

function updateActivity(req,res,next)
{
  activityId = req.body.activityId;
  User.find({"lists.activity._id":activityId},function(err,activities){
    list = activities[0].lists.filter(function(l){
      activity = l.activity.filter(function(a){
        return a._id == activityId
      });
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
  id = req.params.id;
  User.find({"lists.activity._id":id}, function(err, user){
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

// pass the entire list of activities in rather than just the activity being updated
function update(req,res,next)
{
  User.find({"lists._id":req.params.id},function(err,user){
    if (err) { console.log(err); }

    var idx = req.params.id;
    user[0].lists.forEach(function(list){
      if (list._id == req.params.id)
      {
        list.activity = req.body;
      }
    });
    user[0].save(function(err,u){
      console.log(err);
      res.json(user[0].lists[0].activity.pop());
    });
  });
}

module.exports = {
  create: create,
  index: index,
  show: show,
  getActivity: getActivity,
  updateActivity: updateActivity,
  destroy: destroy,
  destroyActivity: destroyActivity,
  update: update
};
