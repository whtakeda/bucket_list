// Require resource's model(s).
var User = require("../models/user");
var Activity = require("../models/activity");
// var rp = require("request-promise");
// var env = require('../config/environment');
var _ = require("underscore");

function index(req,res,next)
{
//  User.find({},'lists.activity.id lists.activity.title',function(err,l){
  User.find({},'lists',function(err,l){
    res.json(l[0].lists);
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
  console.log("in destroy list...");
  id = req.params.id;
  User.find({"lists._id":id}, function(err, user){
    // HAVE TO LOOP OVER EVERY LIST TO FIND THE ONE WITH THE RIGHT ID
    user[0].lists.id(id).remove();
    user[0].save();
    res.json(id);
  });
}

module.exports = {
  index: index,
  update: update,
  destroyActivity: destroyActivity,
  destroyList: destroyList
};
