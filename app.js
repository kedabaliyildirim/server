const createError = require('http-errors');
const express = require('express');
const path = require('path');
// const cookieParser = require('cookie-parser');
const logger = require('morgan');
//ENVIORMENT VERIABLES
const dotenv = require('dotenv')
dotenv.config({
  path: './.env'
})
//LOGIN AUTHENTICATION FUNCTION
//SESSION
const redis = require('redis')
const session = require('express-session')
let redisStore = require('connect-redis')(session)
let redisClient;
if (process.env.REDISCLOUD_URL) {
  redisClient = redis.createClient({
    port: process.env.REDIS_PORT,
    host: process.env.REDISCLOUD_URL,
    password: process.env.REDIS_PASSWORD
  })
} else {
  redisClient = redis.createClient
}
const app = express();
//DATABASE
const dataBase = require('./helpers/db.js')
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//USING SESSION SECRETS
app.use(require('express-session')({
  secret: process.env.SESSION_SECRET,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
    secure:false
  },
  store: new redisStore({
    client: redisClient
  }),
  resave: true,
  saveUninitialized: true
}))



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));

//ROUTES
const usersRoot = require('./routes/users.js')
app.use('/users', usersRoot);

//VIEWS



// catch 404 and forward to error handler NO RENDERS AFTER THIS POINT
app.use((res, next) => {
  next(createError(404));
});
// error handler
app.use((err, reqLogIn, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = reqLogIn.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;