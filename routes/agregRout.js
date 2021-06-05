const express = require("express");
const router = express.Router();
const { post, comment } = require("../models/postSchema.js");

const User = require("../models/userSchema");
const cors = require("cors");
const socketApi = require("../helpers/socket");
const localUrl = "http://localhost:8080";
const url = "https://vue-test-47cc0.web.app";
const corsUrl = "https://stormy-mountain-28848.herokuapp.com";
const netifyUrl = "https://stoic-turing-035110.netlify.app";
router.use(
  cors({
    credentials: true,
    origin: {
      url,
      localUrl,
      corsUrl,
      netifyUrl,
    },
  })
);
router.get("/getposts", (req, res) => {
  const agreTest = post.aggregate([
      {
          $match:{}
      },
      {
          $sort:{createdAt:-1 }
      }
  ])
  agreTest.then((data) => {
      res.send(data)
  }).catch((err)=> {
      res.send(err)
  })
})
module.exports = router;
