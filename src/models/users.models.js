const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    number: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      unique: true,
      default: "",
    },
    gender: {
      type: String,
      default: "",
    },
    dob: {
      type: Date,
      default: null,
    },
    pincode: {
      type: Number,
      default: null,
    },
    address: {
      type: String,
      default: "",
    },
    localty: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    state: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
