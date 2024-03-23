const mongoose = require("mongoose");

const adminSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (email) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(email);
        },
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: function (password) {
          return password.length >= 6;
        },
        message: (props) => `Password must be at least 6 characters long!`,
      },
    },
  },
  { timestamps: true }
);

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
