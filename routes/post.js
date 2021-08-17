const express = require("express");
const router = express.Router();
const User = require("../models/userSchema.js");
const dummyUser = require("../models/dumySchema.js");
const socketApi = require("../helpers/socket");
const { post } = require("../models/postSchema.js");
const cors = require("cors");
const corsList = require("../helpers/CORSHelper.js");

router.use(
  cors({
    credentials: true,
    origin: corsList,
  })
);
const getIo = (Post) => {
  if (Post) {
    const postIt = {
      author: {
        name: Post.user.userName,
      },
      body: {
        title: Post.body.title,
        message: Post.body.message,
      },
      _id: Post._id,
      date: Post.createdAt,
    };
    socketApi.io.emit("updateHome", postIt);
  } else {
    const message = "regular update";
    socketApi.io.emit("updateHome", message);
  }
};
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
router.post("/getpost", async (req, res) => {
  const { postId } = req.body;
  if (postId) {
    post
      .findOne({
        _id: postId,
      })
      .then((response) => {
        res.send(response);
      })
      .catch((err) => {
        res.send(err);
      });
  } else res.send("error");
});
let postId = null;
router.post("/", async (req, res) => {
  if (req.session.user_id) {
    const { title, message } = req.body;
    if (title && message) {
      if (req.session.user_type === "regular") {
        const user = await User.findById(req.session.user_id);
        postFunction(User, user, title, message, req, res);
      } else if (req.session.user_type === "google") {
        const user = await dummyUser.findById(req.session.user_id);
        postFunction(dummyUser, user, title, message, req, res);
      } else if (req.session.user_type === "facebook") {
        const user = await dummyUser.findById(req.session.user_id);
        postFunction(dummyUser, user, title, message, req, res);
      }
    } else {
      res.send("validation error");
    }
  } else {
    res.send("loginerror");
  }
});

router.post("/delete", async (req, res) => {
  const { itemId } = req.body;
  await post.findByIdAndDelete(itemId).then(async () => {
    await User.findOneAndUpdate(
      {
        _id: req.session.user_id,
      },
      {
        $pull: {
          child: {
            _id: itemId,
          },
        },
      },
      (err, user) => {}
    )
      .then(() => {
        getIo();
        res.send("success");
      })
      .catch((err) => {
        res.send(err);
      });
  });
  res.send("deleted");
});
router.post("/deleteall", async (req, res) => {
  const { userName } = req.body;
  await post
    .deleteMany({
      userName: userName,
    })
    .then(async () => {
      await User.findOneAndUpdate(
        {
          _id: req.session.user_id,
        },
        {
          $unset: {
            child: 1,
          },
        }
      )
        .then(() => {
          getIo();
          res.send("success");
        })
        .catch((err) => {
          res.send(err);
        });
    });
});
module.exports = router;
function postFunction(userType, user, title, message, req, res) {
  const Post = new post({
    user: {
      userName: user.userName,
    },
    body: {
      title,
      message,
    },
  });
  Post.save().then((data) => {
    getIo();
    userType
      .findOneAndUpdate(
        {
          _id: req.session.user_id,
        },
        {
          $addToSet: {
            child: Post,
          },
        },
        {
          new: true,
        },
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      )
      .then(() => {});
    res.send(data);
  });
}
