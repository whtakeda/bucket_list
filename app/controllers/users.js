// Require resource's model(s).
var User = require("../models/user");
var Activity = require("../models/activity");
// var rp = require("request-promise");
// var env = require('../config/environment');
var _ = require("underscore");

function index(req,res,next)
{
  User.find({},'lists',function(err,l){
//    console.log(l);
    res.json(l[0].lists);
  });
}

module.exports = {
  index: index
};
