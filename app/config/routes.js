var express = require('express'),
    router  = express.Router();
// TODO: clean out default routes scaffolded in routes folder
// Require controllers.
//var usersController   = require('../controllers/users');
var activitiesController   = require('../controllers/activities');
//var listsController   = require('../controllers/lists');

module.exports = function(app) {
  app.post('/activities',activitiesController.create);

  //index.js
  router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
  });

  app.get('/activities',activitiesController.create);
  router.get('/test',activitiesController.test);


  app.use('/',router);
}
