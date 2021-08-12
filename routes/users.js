const express = require("express");
const router = express.Router();
const User = require("../models/userSchema.js");
const dummyUser = require("../models/dumySchema.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { OAuth2Client } = require("google-auth-library");
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
router.post("/register", async (req, res) => {
  const { token } = req.body;
  const decoded = await jwt.decode(token, process.env.JWT_SECRET, {
    algorithm: "HS256",
  });
  if (decoded.user.type === "regularRegister") {
    try {
      await User.findOrCreate(
        { userName: decoded.user.userName },
        {
          userName: decoded.user.userName,
          password: decoded.user.password,
          email: decoded.user.email,
          userAge: decoded.user.userAge,
          chat: decoded.user.chat,
        },
        (data) => {
          console.log(JSON.stringify(data));
          req.session.user_type='regular'
          req.session.user_id = user._id;
          res.send(user._id);
        }
      );
    } catch (error) {
      console.error(`this is regularRegister error ${error}`);
      res.send("error");
    }

    return;
  }
  if (decoded.user.type === "googleRegister") {
    try {
      let userName = decoded.user.name + decoded.user.surname
      if(dummyUser.exists({userName:userName})) {
        userName = userName + Math.floor(Math.random() * 10000)
      }
      const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
      async function verify() {
        const ticket = await client.verifyIdToken({
          idToken: decoded.user.idToken,
          audience: process.env.GOOGLE_CLIENT_ID,
        });
        const newload = ticket.getPayload();
      }
      verify().then(() => {
        dummyUser.findOrCreate(
          { googleId: decoded.user.googleId },
          {
            googleId: decoded.user.googleId,
            userName: decoded.user.name + ' ' + decoded.user.surname,
            user: {
              name: decoded.user.name,
              surname: decoded.user.surname,
              email: decoded.user.email,
            },
            authentication: {
              idToken: decoded.user.idToken,
            },
          },
          (err, user) => {
            if (err) {
              console.log(`this is error ${err}`);
              return;
            }
            req.session.user_type = 'google'
            req.session.user_id = user._id;
            res.send(user._id);
          }
        );
      });

      return;
    } catch (error) {
      console.log(error);
      res.send('error')
    }
  }
});
router.post("/login", async (req, res) => {
  const { token } = req.body;
  const decoded = await jwt.decode(token, process.env.JWT_SECRET, {
    algorithm: "HS256",
  });
  const userName = decoded.user.userName;
  const password = decoded.user.password;
  const find = await User.findOne({
    userName,
  });
  const currUser = await find;
  await bcrypt
    .compare(password, currUser.password)
    .then(async (data) => {
      if (data) {
        await req.session.save(async () => {
          req.session.isLogged = true;
          req.session.user_id = currUser._id;
          await res.send(currUser._id);
        });
      } else
        await req.session.save(() => {
          req.session.isLogged = false;
        });
    })
    .catch((err) => {
      console.log(`login error ${err}`);
      res.send("error");
      console.log(`this is login err : ${err}`);
    });
});
router.post("/logout", (req, res) => {
  req.session.destroy();
  res.send("success");
});
router.post("/checkauth", async (req, res) => {
  if (req.session.user_id) {
    res.send("success");
  } else {
    console.log(`this is checauth error`);
    res.send("error");
  }
}),
  router.post("/doesUserExists", async (req, res) => {
    const { userName } = req.body;
    User.countDocuments({ userName: userName }, (err, count) => {
      if (count > 0) {
        res.send(true);
      } else res.send(false);
    });
  });
router.post("/jwtsign", async (req, res) => {
  const { payload } = req.body;
  const decoded = jwt.decode(payload, process.env.JWT_SECRET, {
    algorithm: "HS256",
  });
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: decoded.user.idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const newload = ticket.getPayload();
    const userId = newload["sub"];
    console.log(`this is user id : ${userId}`);
  }
  verify().then(() => {
    try {
      dummyUser.findOrCreate(
        { googleId: decoded.user.gId },
        {
          googleId: decoded.user.gId,
          user: {
            name: decoded.user.name,
            surname: decoded.user.surname,
            email: decoded.user.email,
          },
          authentication: {
            idToken: decoded.user.idToken,
          },
        },
        (err, user) => {
          if (err) {
            console.log(`this is error ${err}`);
            res.send("error");
          }
          res.send("success");
        }
      );
    } catch (error) {
      console.log(error);
      res.send("error");
    }
  });
});
module.exports = router;
