const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const usersRoot = require('./routes/users.js')
//ENVIORMENT VERIABLES
const dotenv = require('dotenv')
dotenv.config()
//LOGIN AUTHENTICATION FUNCTION
const reqLogIn = require('./helpers/auth')
//SESSION
const session = require('express-session')
const app = express();
//DATABASE
const dataBase = require('./helpers/db.js')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//USING SESSION SECRETS
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//ROUTES
app.use('/users', usersRoot);

//VIEWS



// catch 404 and forward to error handler NO RENDERS AFTER THIS POINT
app.use((reqLogIn, res, next) => {
  next(createError(404));
});
// error handler
app.use((err, reqLogIn, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = reqLogIn.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;