// Require resource's model(s).
// var User = require("../models/user");
var Activity = require("../models/activity");
// var rp = require("request-promise");
// var env = require('../config/environment');
var _ = require("underscore");

function create(req,res,next)
{
  activity = new Activity(req.body);
  activity.save();
  res.json(req.body);
}

function index(req,res,next)
{
  Activity.find({},'title _id',function(err,activities){
    if (err) { console.log(err); }
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
