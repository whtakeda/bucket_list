// Require resource's model(s).
// var User = require("../models/user");
var Activity = require("../models/activity");
// var rp = require("request-promise");
// var env = require('../config/environment');
var _ = require("underscore");

function create(req,res,next)
{
  console.log(JSON.stringify(req.body));
  activity = new Activity();
  activity.title = req.body.title;
  activity.description = req.body.description;
  activity.location = req.body.location;
  activity.cost = req.body.cost;
  activity.duration = req.body.duration;

  activity.save(function(err){
    if (err) { console.log(err); }
  });
  res.json(req.body);
}

function index(req,res,next)
{
  console.log("activities.index");
  Activity.find({},'title _id',function(err,activities){
    console.log("I am in here now")
    if (err) { console.log("the error is " + err); }
    res.json(activities);
  });
}

function show(req,res,next)
{
//  console.log(req.params.id);
  Activity.find({"_id":req.params.id},function(err,activity){
    if (err) { console.log(err); }
    res.json(activity);
  });
}

function update(req,res,next)
{
//  console.log(req.params.id);
  Activity.find({"_id":req.params.id},function(err,activity){
    if (err) { console.log(err); }
//    activity._id = req.body._id;
    activity[0].title = req.body.title;
    activity[0].description = req.body.description;
    activity[0].rating = req.body.rating;
    activity[0].location = req.body.location;
    activity[0].cost = req.body.cost;
    activity[0].duration = req.body.duration;
    activity[0].tags = req.body.tags;
    activity[0].save();
    res.json(activity);
  });
}

module.exports = {
  create: create,
  index: index,
  show: show,
  update: update
};
