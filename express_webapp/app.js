const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// Import route modules
const indexRouter = require('./routes/index');
const user = require('./routes/user_add');
const connect = require('./routes/connect');
const activities = require('./routes/activities');
const disconnect = require('./routes/disconnect');
const main = require('./routes/main');
const upload = require('./routes/upload');
const apropos = require('./routes/apropos');

// Initialize session management
const session = require('express-session');
const app = express();

// Initialize file upload handling with multer
const multer = require('multer');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configure sessions with a secret key
app.use(session({
  secret: 'sports-track-secret-key', // Change this to a secure secret key
  resave: false,
  saveUninitialized: true,
}));

// Configure multer storage settings for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req,file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const uploads = multer({ storage: storage });

// Attach routes to their respective endpoints
app.use('/', indexRouter);
app.use('/user_add', user);
app.use('/connect', connect);
app.use('/activities', activities);
app.use('/upload', upload);
app.use('/disconnect', disconnect);
app.use('/main', main);
app.use('/apropos', apropos);

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
  console.error(err.stack);
  res.render('error', {error: err});
});

module.exports = app;
