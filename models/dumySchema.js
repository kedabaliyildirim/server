const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { postSchema } = require("./postSchema.js");
const findOrCreate = require("mongoose-findorcreate");
const dummySchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  userName: {
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
      required: false,
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
  child: [postSchema],
});
dummySchema.plugin(findOrCreate);
module.exports = mongoose.model("dummy", dummySchema);
