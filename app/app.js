var express = require('express'),
    path = require('path'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    env = process.env.NODE_ENV || "development";

var mongo = require('mongodb'),
    monk = require('monk'),
    db = monk('localhost:27017/backpack');

var routes = require('./app/routes/index');

var app = express();

if (env === "development") {
  // Include live reload
  var livereload = require('connect-livereload'),
      livereloadport = 35729;

  app.use(livereload({ port: livereloadport }));
}

// view engine setup
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// make db accessible to router
app.use(function(req,res,next){
  req.db = db;
  next();
});

app.use('/', routes);

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

var serverport = Number(process.env.PORT || 3000);

app.listen(serverport, function() {
  console.log('Listening on port %d', serverport);
});