const jwt = require("jsonwebtoken");
const User = require("../models/users.models");
const Seller = require("../models/seller.models");
const Admin = require("../models/admin.models");
require("dotenv").config();

// User Protected Routes -->
const auth = async (req, res, next) => {
  try {
    let token = "";
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res
        .status(400)
        .json({ message: "You are not logged in. Please login to get access" });
    }

    const data = jwt.verify(token, process.env.JWT_SECRET);
    if (!data) {
      return res
        .status(400)
        .json({ message: "You are not logged in. Please login to get access" });
    }
    if (data.role !== "user") {
      return res.status(400).json({ message: "Only user will have access." });
    }
    let user = await User.findById({ _id: data.id });
    if (!user) {
      return res
        .status(400)
        .json({ message: "You are not logged in. Please login to get access" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

// Seller Protected Routes -->
const seller = async (req, res, next) => {
  try {
    let token = "";
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res
        .status(400)
        .json({ message: "You are not logged in. Please login to get access" });
    }

    const data = jwt.verify(token, process.env.JWT_SECRET);
    if (!data) {
      return res
        .status(400)
        .json({ message: "You are not logged in. Please login to get access" });
    }
    if (data.role !== "seller") {
      return res.status(400).json({ message: "Only seller will have access." });
    }
    let seller = await Seller.findById({ _id: data.id });
    if (!seller) {
      return res
        .status(400)
        .json({ message: "You are not logged in. Please login to get access" });
    }

    req.user = seller;
    next();
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

const admin = async (req, res, next) => {
  try {
    let token = "";
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res
        .status(400)
        .json({ message: "You are not logged in. Please login to get access" });
    }

    const data = jwt.verify(token, process.env.JWT_SECRET);
    if (!data) {
      return res
        .status(400)
        .json({ message: "You are not logged in. Please login to get access" });
    }
    if (data.role !== "admin") {
      return res.status(400).json({ message: "Only admin will have access." });
    }
    const admin = await Admin.find({ _id: data.id });
    if (!admin) {
      return res
        .status(400)
        .json({ message: "You are not logged in. Please login to get access" });
    }

    req.user = admin;
    next();
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

module.exports = {
  auth,
  seller,
  admin,
};
