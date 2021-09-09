const express = require("express");
const router = express.Router();
const axios = require("axios");
const User = require("../models/userSchema.js");
const dummyUser = require("../models/dumySchema.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { OAuth2Client } = require("google-auth-library");
const cors = require("cors");
const corsList = require("../helpers/CORSHelper.js");
const socketApi = require("../helpers/socket.js");
router.use(
  cors({
    credentials: true,
    origin: corsList,
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
        { upsert: true },
        (data) => {
          console.log(JSON.stringify(data));
          req.session.user_type = "regular";
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
      let userName = decoded.user.name + decoded.user.surname;
      if (dummyUser.exists({ userName: userName })) {
        userName = userName + Math.floor(Math.random() * 10000);
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
        console.log(
          `this is userName : ${decoded.user.name + " " + decoded.user.surname}`
        );
        dummyUser.findOrCreate(
          { userId: decoded.user.googleId },
          {
            userId: decoded.user.googleId,
            userName: decoded.user.name + " " + decoded.user.surname,
            user: {
              name: decoded.user.name,
              surname: decoded.user.surname,
              email: decoded.user.email,
            },
            authentication: {
              idToken: decoded.user.idToken,
            },
          },
          { upsert: true },
          (err, user) => {
            if (err) {
              console.log(`this is error ${err}`);
              return;
            }
            req.session.user_type = "google";
            req.session.user_id = user._id;
            res.send(user._id);
          }
        );
      });

      return;
    } catch (error) {
      console.log(error);
      res.send("error");
    }
  }
  if (decoded.user.type === "facebookRegister") {
    try {
      let userName = decoded.user.name + decoded.user.surname;
      if (dummyUser.exists({ userName: userName })) {
        userName = userName + Math.floor(Math.random() * 10000);
      }
      axios
        .get(process.env.FACEBOOK_GRAPHAPI_URL + decoded.user.idToken)
        .then((response) => {
          if (response.message === "Invalid OAuth access token") {
            res.send("error");
            return;
          }
          dummyUser.findOrCreate(
            { userId: decoded.user.facebookId },
            {
              userId: decoded.user.facebookId,
              userName: decoded.user.name + " " + decoded.user.surname,
              user: {
                name: decoded.user.name,
                surname: decoded.user.surname,
                email: decoded.user.email,
              },
              authentication: {
                idToken: decoded.user.idToken,
              },
            },
            { upsert: true },
            (err, user) => {
              if (err) {
                console.log(`this is error ${err}`);
                return;
              }
              req.session.user_type = "facebook";
              req.session.user_id = user._id;
              res.send(user._id);
            }
          );
        });
    } catch (error) {}
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
          req.session.user_type = "regular";
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
  if (req.session.user_type === "facebook") {
    socketApi.io.emit("facebookLogOut ");
  }
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
module.exports = router;
