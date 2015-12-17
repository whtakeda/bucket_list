// Require resource's model(s).
var User = require("../models/user");
var Activity = require("../models/activity");
// var rp = require("request-promise");
// var env = require('../config/environment');
var _ = require("underscore");

function create(req,res,next)
{
  activity = new Activity();
  activity.title = req.body.title;
  activity.description = req.body.description;
  activity.location = req.body.location;
  activity.cost = req.body.cost;
  activity.duration = req.body.duration;

  activity.save(function(err,data){
    if (err) { console.log(err); }
    res.json(data);
  });
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
//  console.log("looking for activity with id..." + req.params.id)
  Activity.find({"_id":req.params.id},function(err,activity){
    if (err) { console.log(err); }
//    console.log("found record..." + activity)
    res.json(activity);
  });
}

function update(req,res,next)
{
  Activity.find({"_id":req.params.id},function(err,activity){
    if (err) { console.log(err); }
    activity[0].title = req.body.title;
    activity[0].description = req.body.description;
//    activity[0].rating = activity[0].rating + req.body.rating;
    activity[0].rating = req.body.rating;
    activity[0].location = req.body.location;
    activity[0].cost = req.body.cost;
    activity[0].duration = req.body.duration;
    activity[0].tags = req.body.tags;
    activity[0].save();
    res.json(activity);
  });
}

function destroy(req,res,next)
{
  id = req.params.id;
  User.find({"lists.activity._id":id}, function(err, user){
    if (err) { console.log(err); }
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


module.exports = {
  create: create,
  index: index,
  show: show,
  update: update,
  destroy: destroy
};
