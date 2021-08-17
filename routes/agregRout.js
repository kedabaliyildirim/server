const express = require("express");
const router = express.Router();
const { post, comment } = require("../models/postSchema.js");

const User = require("../models/userSchema");
const cors = require("cors");
const socketApi = require("../helpers/socket");
const corsList = require('../helpers/CORSHelper.js');
router.use(
  cors({
    credentials: true,
    origin: corsList
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
