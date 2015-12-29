var express = require('express'),
    router  = express.Router();
// TODO: clean out default routes scaffolded in routes folder
// Require controllers.
//var usersController   = require('../controllers/users');
var activitiesController   = require('../controllers/activities');
var listsController = require('../controllers/lists');
var usersController = require('../controllers/users');

module.exports = function(app, passport) {

  app.post('/login', usersController.userAuth);
  app.post('/users', usersController.create);
  app.get('/users/:id',  usersController.tokenVerify, usersController.show);

  app.post('/activities', usersController.tokenVerify, activitiesController.create);
  app.post('/lists', usersController.tokenVerify, listsController.create);

  //index.js
  router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
  });

  app.get('/activities',activitiesController.index);
  app.get('/activities/:id', activitiesController.show);
  app.put('/activities/:id', usersController.tokenVerify, activitiesController.update);

  app.get('/lists/:id',listsController.show);
  app.get('/lists/:listid/activity/:activityid', usersController.tokenVerify, listsController.getActivity);
  app.put('/lists/:id', usersController.tokenVerify, listsController.update);
  app.put('/lists/activity/:id', usersController.tokenVerify, listsController.updateActivity);
  app.delete('/lists/:id', usersController.tokenVerify, listsController.destroy);
  app.delete('/lists/activity/:id',usersController.tokenVerify, listsController.destroyActivity);

  app.use(function(req, res, next){
//    console.log("set user to " + req.user);
    res.locals.user = req.user;
    next();
  });

  router.get('/me', usersController.tokenVerify, function(req, res){
    res.send(req.decoded);
  });


  // OAuth route
  router.get('/auth/google', passport.authenticate(
    'google',
    { scope: ['profile','email'] }
  ));

  // Google OAuth callback route
  router.get('/oauth2callback', passport.authenticate(
    'google',
    {
      successRedirect : '/',
      failureRedirect : '/'
    }
  ));

  // OAuth logout
  router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

  app.use('/',router);
}

function isLoggedIn(req, res, next) {
  if ( req.isAuthenticated() ) return next();
  res.redirect('/auth/google');
}
