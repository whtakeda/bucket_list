var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');

var routes = require('./app/config/routes');

var mongoose = require('./app/config/database');
var env = require('./app/config/environment');

var app = express();

require('dotenv').load();
var test = process.env.BASE_URL;
// view engine setup
app.set('views', path.join(__dirname, 'public/app'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public/app')));

app.use(session({
  secret: 'WDIRocks!',
  resave: false,
  saveUninitialized: true
}));

// mount passport
app.use(passport.initialize());
app.use(passport.session());

require('./app/config/passport')(passport);
require('./app/config/routes')(app,passport);
app.use('/', routes);
//app.use(express.static("public/app"));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
  console.log(err.status);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
