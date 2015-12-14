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
    console.log(req.body);
    var idx = req.params.id;
    user[0].lists[idx].activity = req.body;
    user[0].save();
    res.json(req.body)
  });
}

function update(req,res,next)
{
  User.find({},function(err,user){
    if (err) { console.log(err); }
    console.log(req.body);
    var idx = req.params.id;
    user[0].lists[idx].activity = req.body;
    user[0].save();
    res.json(req.body)
  });
}

function destroy(req,res,next)
{
  activityId = req.params.id;
  User.find({"lists.activity._id":activityId}, function(err, user){
    // HAVE TO LOOP OVER EVERY LIST TO FIND THE ONE WITH THE RIGHT ACTIVITY
    console.log(user[0].lists[1].activity.id(activityId));
    // user[0].activity._id(activityId).remove();
    // user[0].save(function(err){
    //   res.json(JSON.stringify(activityId));
    // });
  });
}

module.exports = {
  index: index,
  update: update,
  destroy: destroy
};
