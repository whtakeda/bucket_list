// Require resource's model(s).
// var User = require("../models/user");
var Activity = require("../models/activity");
// var rp = require("request-promise");
// var env = require('../config/environment');
var _ = require("underscore");

var create = function(req,res,next)
{

  console.log(req.body);
  activity = new Activity(req.body);
  activity.save();
  res.json(JSON.stringify(req.body));

      // user.spots.push({
      //   title: title,
      //   description: description,
      //   flickr_url: flickrUrl,
      //   image_url: imageUrl,
      //   address: address,
      //   lat: lat,
      //   lng: lng,
      //   zipcode: zipcode,
      //   rating: rating,
      //   tags: tags //need logic on how to insert multiple tags data into tagSchema
      // });
      // user.save(function(err) {
      //   res.redirect('/');  // TODO: why doesn't render work?  i have to redirect to make it work
      // });
}

var test = function(req,res,next)
{
  res.json("testing");
}

module.exports = {
  create: create,
  test: test
};
