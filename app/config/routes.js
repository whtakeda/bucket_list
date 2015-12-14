var express = require('express'),
    router  = express.Router();
// TODO: clean out default routes scaffolded in routes folder
// Require controllers.
//var usersController   = require('../controllers/users');
var activitiesController   = require('../controllers/activities');
var listsController = require('../controllers/lists');
var usersController = require('../controllers/users');

module.exports = function(app, passport) {
  app.post('/activities',isLoggedIn,activitiesController.create);
  app.post('/lists',isLoggedIn,listsController.create);

  //index.js
  router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
  });

  app.get('/activities',activitiesController.index);

  app.get('/lists',usersController.index);
  app.put('/lists',usersController.update); // non-standard route b/c entire list is updated at one time



  app.use(function(req, res, next){
    console.log("set user to " + req.user);
    res.locals.user = req.user;
    next();
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
