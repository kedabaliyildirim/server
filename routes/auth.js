const express = require("express");
const router = express.Router();
const passportGoogle = require("../middleware/OAuth2.js");
const corsList = require('../helpers/CORSHelper.js');
const cors = require("cors");
router.use(
  cors({
    credentials: true,
    origin: corsList,
  })
);
router.get(
  "/google",
  passportGoogle.authenticate("google", {
    scope: ["https://www.googleapis.com/auth/userinfo.profile"],
  })
);

router.get("/google/callback", (req, res) => {
  console.log("whaaaat");
});
module.exports = router;
