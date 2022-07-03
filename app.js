const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const passport = require("passport");
const dotenv = require('dotenv');
const redis = require('redis');
dotenv.config();


//ENVIORMENT VERIABLES

//LOGIN AUTHENTICATION FUNCTION
//SESSION
const session = require('express-session')
//redis connection
async function redisConnect() {

  const client = redis.createClient({
    port: process.env.REDIS_PORT,
    host: process.env.REDISCLOUD_URL,
    password: process.env.REDIS_PASSWORD,
  });

  client.on('error', (err) => console.log('Redis Client Error', err));

  await client.connect();

  await client.set('key', 'value');
  const value = await client.get('key');
}
redisConnect();
const app = require("express")();
//DATABASE
// eslint-disable-next-line no-unused-vars
const dataBase = require("./helpers/db.js");
// esLint-disable-next-line no-unused-vars
const corsList = require("./helpers/CORSHelper.js");
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//USING SESSION SECRETS
app.all("/", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});
app.use(
  require("express-session")({
    secret: process.env.SESSION_SECRET,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: false,
      secure: false,
      // sameSite: "none",
    },
    proxy: true,
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(logger("dev"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//ROUTES
const usersRoot = require("./routes/users.js");
const postRoot = require("./routes/post.js");
const indexRoot = require("./routes/index.js");
const commentRoot = require("./routes/comment.js");
const agregationRouter = require("./routes/agregRout");
const authorizationRoute = require("./routes/auth");
app.use("/users", usersRoot);
app.use("/post", postRoot);
app.use("/", indexRoot);
app.use("/comment", commentRoot);
app.use("/agreg", agregationRouter);
app.use("/auth", authorizationRoute);
//VIEWS

// catch 404 and forward to error handler NO RENDERS AFTER THIS POINT
app.use((req, res, next) => {
  next(createError(404));
});
// error handler
app.use((err, reqLogIn, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = reqLogIn.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
module.exports = app;