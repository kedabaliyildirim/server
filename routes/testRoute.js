const express = require("express");
const router = express.Router();
const User = require("../models/userSchema.js");
const dummyUser = require("../models/dumySchema.js");
const socketApi = require("../helpers/socket");
const {
    post
} = require("../models/postSchema.js");
const cors = require("cors");
const corsList = require("../helpers/CORSHelper.js");
router.get("/getposts", async (req, res) => {
    const agreTest = post.aggregate([
        {
            $match: {},
        },
        {
            $sort: { createdAt: -1 },
        },
    ]);
    agreTest
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.send(err);
        });
});