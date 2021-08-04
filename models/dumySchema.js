const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { postSchema } = require("./postSchema.js");
const findOrCreate = require("mongoose-findorcreate");
const dummySchema = mongoose.Schema({
  googleId: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    name: {
      type: String,
      required: true,
      unique: false,
    },
    surname: {
      type: String,
      required: true,
      unique: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
  },
  authentication: {
    idToken: {
      type: String,
      required: true,
      unique: true,
    },
  },
});
dummySchema.plugin(findOrCreate);
module.exports = mongoose.model("dummy", dummySchema);
