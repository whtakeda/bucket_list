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
console.log("in update...");
  User.find({},function(err,user){
    if (err) { console.log(err); }
    req.body.forEach(function(activity){
      console.log("aid is " + activity.activityId)
      // when a new record comes in, it has an _id, which needs to be converted to
      // an activityId.  if a record already has an activityId, do not overwrite it
      // with the _id.
      if (activity.activityId === undefined)
      {
        console.log("changing id for " + activity.title)
        activity.activityId = activity._id;
        delete activity._id;
      }
      else
      {
        console.log("not changing id for " + activity.title)
      }
    })
//    console.log("updating list...." + JSON.stringify(req.body));
    var idx = req.params.id;
    // console.log("idx is " + idx);
    console.log(user[0]);
    user[0].lists[idx].activity = req.body;
    // console.log(user);
    console.log(user[0]);
    user[0].save(function(err,u){
      console.log(err)
      res.json(u);
    });
  });
}

function destroyActivity(req,res,next)
{
  id = req.params.id;
//  console.log("id is " + id);
  User.find({"lists.activity._id":id}, function(err, user){
    // HAVE TO LOOP OVER EVERY LIST TO FIND THE ONE WITH THE RIGHT ID
//    console.log("user is " + user);
    user[0].lists.forEach(function(list){
    if (list.activity.id(id) !== null)
    {
  //    console.log(list.activity);
      list.activity.id(id).remove();
      user[0].save();
      res.json(JSON.stringify(id));
    }
  })
    // user[0].activity._id(activityId).remove();
    // user[0].save(function(err){
    //   res.json(JSON.stringify(activityId));
    // });
  });
}

function destroyList(req,res,next)
{
  console.log("in destroy list...");
  id = req.params.id;
//  console.log("id is " + id);
  User.find({"lists._id":id}, function(err, user){
    // HAVE TO LOOP OVER EVERY LIST TO FIND THE ONE WITH THE RIGHT ID
//    console.log("user is " + user);
console.log(user[0]);
    user[0].lists.id(id).remove();
    user[0].save();
    res.json(id);
//console.log(user[0]);

    // user[0].activity._id(activityId).remove();
    // user[0].save(function(err){
    //   res.json(JSON.stringify(activityId));
    // });
  });
}

module.exports = {
  index: index,
  update: update,
  destroyActivity: destroyActivity,
  destroyList: destroyList
};
