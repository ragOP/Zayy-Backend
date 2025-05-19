const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin.models");
const User = require("../models/users.models");
const Seller = require("../models/seller.models");
const cloudinary = require("../utils/cloudniary.utils");
const fs = require("fs");

require("dotenv").config();


// Admin Login -->
const handleLoginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Admin.findOne({ email });
    if (!user) return res.status(404).json({ message: "No admin found!" });
    // const verify = bcrypt.compareSync(password, user.password);
    // if (!verify)
    //   return res.status(401).json({ message: "Unauthorized access!" });
    const token = jwt.sign(
      {
        id: user._id,
        role: "admin",
      },
      process.env.JWT_SECRET
    );
    return res.status(200).json({
      message: "Admin fetched sucessfully",
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "err " + error });
  }
};

// User Login Route -->
const handleUserLogin = async (req, res) => {
  try {
    const { number } = req.body;
    let user = await User.findOne({ number });
    if (user === null) {
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
    console.log(error);
    res.status(500).json({ message: "err " + error });
  }
};

// Add User Details -->
const handleUserDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      name,
      email,
      gender,
      dob,
      address,
      pincode,
      localty,
      city,
      state,
      type,
    } = req.body;
    await User.findByIdAndUpdate(userId, {
      name,
      email,
      gender,
      dob,
      address,
      pincode,
      localty,
      city,
      state,
      type,
    });
    return res.status(200).json({ message: "Updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "err " + error });
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
      pincode,
      localty,
      city,
      state,
      country,
      account_no,
      ifsc_code,
      bank_name,
      branch_name,
      account_holder_name,
      business_type,
      description,
      upi
    } = req.body;
    const exisitingSeller = await Seller.findOne({ email });
    if (exisitingSeller) {
      return res
        .status(400)
        .json({ message: "Seller already exists, Please Login." });
    }
    const hashedPassword = await bcrypt.hashSync(password, salt);
    let logoUrl = "";
    if (req.file) {
      const logoUrlResponse = await cloudinary.uploader.upload(req.file.path);
      logoUrl = logoUrlResponse.secure_url;
      fs.unlinkSync(req.file.path);
    }
    const seller = await Seller.create({
      email,
      password: hashedPassword,
      name,
      website,
      logo: logoUrl,
      address,
      pincode,
      localty,
      city,
      state,
      country,
      account_no,
      ifsc_code,
      bank_name,
      branch_name,
      account_holder_name,
      business_type,
      description,
      upi
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
      return res.status(401).json({ message: "Unauthorized access!" });
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

module.exports = {
  handleLoginAdmin,
  handleUserLogin,
  handleUserDetails,
  handleSellerRegister,
  handleSellerLogin,
};
