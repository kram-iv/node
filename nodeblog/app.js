var createError = require('http-errors');
var express = require('express');
var path = require('path');
//var csrf = require('csurf');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var flash = require('connect-flash');
var multer = require('multer');
// Handle file uploads
var upload = multer({dest:'./uploads'});

var multer = require('multer');

const { check, validationResult } = require('express-validator');
var db = require('monk')('localhost/nodeblog');

db.then(() => {
  console.log('Connected successfully to mongodb server')
}).catch(() => {
  console.log('Connection to mongodb server failed!!');
});

var indexRouter = require('./routes/index');
var postsRouter = require('./routes/posts');
var categoriesRouter = require('./routes/categories');

var app = express();

app.locals.moment = require('moment');
app.locals.truncateText = (text,length) => {
  var truncatedText = text.substring(0, length);
  return truncatedText;
}
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//var csrfProtection = csrf();

app.use(cookieParser());

// Handle sessions
app.use(session({
	secret:'secret',
	saveUninitialized: true,
  resave: true/*,
  httpOnly: true,
  secure: true*/
}));

//app.use(csrfProtection);

// Connect flash
app.use(flash());
app.use(require('connect-flash')());
app.use(express.static(path.join(__dirname, 'public')));


app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Make our db accessible to our router
app.use (function(req,res,next) {
  req.db = db;
  next();
});
/*
app.use( (req, res, next) => {
  var token = req.csrfToken();
  //res.cookie('XSRF-TOKEN', token);
  res.locals.csrfToken = token;
  console.log("TOKEN line 82 "+token);
  next();
});
*/
app.use('/', indexRouter);
app.use('/posts', postsRouter);
app.use('/categories', categoriesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
