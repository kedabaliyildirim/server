const express = require("express");
const router = express.Router();
const User = require("../models/userSchema.js");
const socketApi = require("../helpers/socket");
const { post } = require("../models/postSchema.js");
const cors = require("cors");
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
const getIo = (Post) => {
  if (Post) {
    console.log(`this is getIo Post ${Post.user}`);
    const postIt = {
      author: {
        name: Post.user.userName,
      },
      body: {
          title:Post.body.title,
          message:Post.body.message
      },
      _id: Post._id,
      date:Post.createdAt
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
        $match:{}
    },
    {
        $sort:{createdAt:-1}
    }
])
agreTest.then((data) => {
    res.send(data)
}).catch((err)=> {
    res.send(err)
})
});
router.post("/getpost", async (req, res) => {
  const { postId } = req.body;
  console.log(`postId is ${postId}`);
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
  console.log(req.session.isLogged);
  if (req.session.isLogged) {
    const { title, message, testStatus } = req.body;
    console.log(`this is testStatus ${testStatus}`);
    if (testStatus) {
        console.log('test failed');
      if (title && message) {
        const user = await User.findById(req.session.user_id);
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
          getIo(Post);
          console.log(data._id);
          postId = data._id;
          User.findOneAndUpdate(
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
          ).then(() => {});
          res.send(data);
        });
      } else {
        res.send("validation error");
      }
      setTimeout(async () => {
        console.log(`this is testMode delete with postId ${postId}`);
        console.log(`this is postId ${postId}`);
        const itemId = postId;
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
            (err, user) => {
              // console.log(user);
            }
          )
            .then(() => {
              getIo();
              console.log("deleted");
            })
            .catch((err) => {
              console.log(err);
            });
        });
      }, 9000);
    } else {
      if (title && message) {
        const user = await User.findById(req.session.user_id);
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
          User.findOneAndUpdate(
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
          ).then(() => {});
          res.send(data);
        });
      } else {
        res.send("validation error");
      }
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
      (err, user) => {
        console.log(user);
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
