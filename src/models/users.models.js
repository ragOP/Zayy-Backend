const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    number: {
      type: String,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    gender: {
      type: String,
    },
    dob: {
      type: Date,
    },
    pincode: {
      type: Number,
    },
    address: {
      type: String,
    },
    localty: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    type: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
