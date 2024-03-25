const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin.models");
const User = require("../models/users.models");
const Seller = require("../models/seller.models");
const cloudinary = require("../utils/cloudniary.utils");
const fs = require("fs");

require("dotenv").config();

// Hardcoded OTP As of Now
const OTP = "123456";

// Admin Login -->
const handleLoginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Admin.findOne({ email });
    if (!user) return res.status(404).json({ message: "No Admin Found!" });
    const verify = bcrypt.compareSync(password, user.password);
    if (!verify)
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
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Add User Details -->
const handleUserDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, gender, dob, address } = req.body;
    await User.findByIdAndUpdate(userId, {
      $push: { address },
    });
    await User.findByIdAndUpdate(userId, {
      name,
      email,
      gender,
      dob,
    });
    return res.status(200).json({ message: "Updated Successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Seller Register -->
const handleSellerRegister = async (req, res) => {
  try {
    const {
      email,
      password,
      name,
      website,
      address,
      bankDetails,
      business_type,
    } = req.body;
    const exisitingSeller = await Seller.findOne({ email });
    if (exisitingSeller) {
      return res
        .status(400)
        .json({ message: "Seller already exists, Please Login." });
    }
    const hashedPassword = await bcrypt.hashSync(password, salt);
    const logoUrlResponse = await cloudinary.uploader.upload(req.file.path);
    const logoUrl = logoUrlResponse.secure_url;
    fs.unlinkSync(req.file.path);
    const seller = await Seller.create({
      email,
      password: hashedPassword,
      name,
      website,
      logo: logoUrl,
      business_type,
    });
    await Seller.findByIdAndUpdate(seller._id, {
      $push: { address, bankDetails },
    });
    const token = jwt.sign(
      { id: seller._id, role: "seller" },
      process.env.JWT_SECRET
    );
    return res.status(200).json({
      token,
      email: email,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "err " + error });
  }
};

// Seller Login -->
const handleSellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const seller = await Seller.findOne({ email });
    if (!seller) {
      return res.status(400).json({
        message: "Seller does not exists.",
      });
    }
    const verify = bcrypt.compareSync(password, seller.password);
    if (!verify)
      return res.status(401).json({ message: "Unauthorized Access!" });
    const token = jwt.sign(
      { id: seller._id, role: "seller" },
      process.env.JWT_SECRET
    );
    return res.status(200).json({
      token,
      email: email,
    });
  } catch (error) {
    console.log(err);
    res.status(500).json({ message: "err " + err });
  }
};

module.exports = {
  handleLoginAdmin,
  handleUserLogin,
  handleUserDetails,
  handleSellerRegister,
  handleSellerLogin,
};
