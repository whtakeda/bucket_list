// Require resource's model(s).
var User = require("../models/user");
var Activity = require("../models/activity");
// var rp = require("request-promise");
// var env = require('../config/environment');
var _ = require("underscore");

function index(req,res,next)
{
  User.find({},'lists.activity.id lists.activity.title',function(err,l){
    res.json(l[0].lists);
  });
}

function update(req,res,next)
{
  User.find({},function(err,user){
    if (err) { console.log(err); }
    console.log(req.body);
     user[0].lists[0].activity = req.body;
     user[0].save();
     // console.log(user[0])
     res.json(req.body)
  });
}

module.exports = {
  index: index,
  update:update
};
