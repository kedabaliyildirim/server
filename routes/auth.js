const express = require("express");
const router = express.Router();
const passportGoogle = require("../middleware/OAuth2.js");
const localUrl = "http://localhost:8080";
const url = "https://vue-test-47cc0.web.app";
const corsUrl = "https://stormy-mountain-28848.herokuapp.com";
const netifyUrl = "https://stoic-turing-035110.netlify.app";
const cors = require("cors");
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
router.get(
  "/google",
  passportGoogle.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile"
    ],
  })
);

router.get(
  "/google/callback", (req,res) => {
    console.log('whaaaat');
  }
);
module.exports = router;
