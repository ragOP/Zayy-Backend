const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin.models");
const { default: mongoose } = require("mongoose");
const User = require("../models/users.models");

require("dotenv").config();

// Hardcoded OTP As of Now
const OTP = "123456789";

// Admin Login -->
const handleLoginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Admin.findOne({ email });
    if (!user) return res.status(404).json({ message: "No Admin Found!" });
    const hashedPassword = bcrypt.compareSync(password, user.password);
    if (!hashedPassword)
      return res.status(401).json({ message: "Unauthorized Access!" });
    const token = jwt.sign(
      {
        id: user._id,
        role: "Admin",
      },
      process.env.JWT_SECRET
    );
    return res.status(200).json({
      message: "Admin fetched sucessfully",
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// User Login Route -->
const handleUserLogin = async (req, res) => {
  try {
    const { number, otp } = req.body;

    if (otp !== OTP) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    let user = await User.findOne({ number });
    if (!user) {
      user = await User.create({ number });
      const token = jwt.sign(
        { id: user._id, role: "user" },
        process.env.JWT_SECRET
      );
      return res.status(200).json({ token, isComplete: false });
    }
    const isComplete = !!user.name;
    const token = jwt.sign(
      { id: user._id, role: "user" },
      process.env.JWT_SECRET
    );
    return res.status(200).json({ token, isComplete });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  handleLoginAdmin,
  handleUserLogin,
};
