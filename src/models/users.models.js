const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    number: {
      type: String,
      required: true,
      unique: true,
    },
    name: String,
    email: {
      type: String,
      unique: true,
    },
    gender: String,
    dob: Date,
    code: String,
    addresses: [
      {
        pincode: Number,
        address: String,
        localty: String,
        city: String,
        state: String,
        type: String,
        isdefault: Boolean,
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
