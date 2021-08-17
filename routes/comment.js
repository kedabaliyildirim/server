const express = require("express");
const router = express.Router();
const { post, comment } = require("../models/postSchema.js");
const dummyUser = require("../models/dumySchema.js");
const User = require("../models/userSchema");
const cors = require("cors");
const socketApi = require("../helpers/socket");
const corsList = require('../helpers/CORSHelper.js');
router.use(
  cors({
    credentials: true,
    origin: corsList,
  })
);
const getIo = (postId, comment) => {
  const message = {
    postId: postId,
    body: {
      username: comment.userName,
      message: comment.comment,
      _id: comment._id,
    },
  };
  socketApi.io.emit("updatePost", message);
};
router.post("/getcomments", (req, res) => {
  const { postId } = req.body;
  if (postId !== "undefined") {
    if (postId !== null) {
      post.findOne(
        {
          _id: postId,
        },
        (err, data) => {
          res.send(data.child);
        }
      );
    } else res.send("body_error");
  } else res.send("body_error");
});
router.post("/", (req, res) => {
  try {
    const { Comment, postId } = req.body;
    if (Comment) {
      const userId = req.session.user_id;
      if (req.session.user_type === "regular") {
        commentFunction(User, userId, Comment, postId, res);
      } else if (req.session.user_type === "google") {
        commentFunction(dummyUser, userId, Comment, postId, res);
      }
    } else res.send("error");
  } catch (error) {
    console.log(error);
  }
});
router.post("/deletecomment", (req, res) => {
  const { commentId, postId } = req.body;
  comment
    .findByIdAndDelete({
      _id: commentId,
    })
    .then(() => {
      post
        .findByIdAndUpdate(
          {
            _id: postId,
          },
          {
            $pull: {
              child: {
                _id: commentId,
              },
            },
          }
        )
        .then(() => {
          res.send("success");
        })
        .catch((err) => {
          res.send(err);
        });
    });
});
router.get("/test", (req, res) => {
  const { postId } = req.body;
  post.findOne({ _id: postId }, (err, data) => {
    res.send(data);
  });
});

module.exports = router;

function commentFunction(userType, userId, Comment, postId, res) {
  userType.findOne(
    {
      _id: userId,
    },
    (err, user) => {
      if (user) {
        const comentPost = new comment({
          userName: user.userName,
          comment: Comment,
        });
        comentPost.save().then(() => {
          post
            .findOneAndUpdate(
              {
                _id: postId,
              },
              {
                $addToSet: {
                  child: comentPost,
                },
              }
            )
            .then(() => {
              getIo(postId, comentPost);
              res.send("success");
            });
        });
      } else res.send("error");
    }
  );
}
