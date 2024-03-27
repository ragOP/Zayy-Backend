const jwt = require("jsonwebtoken");
const Admin = require("../models/admin.models");
const User = require("../models/users.models");
require("dotenv").config();

// Admin Protected Routes -->
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
  } catch (err) {
    res.status(400).json({ message: err });
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

    const data = jwt.verify(token, process.env.JWT_KEY);
    if (!data) {
      return res
        .status(400)
        .json({ message: "You are not logged in. Please login to get access" });
    }
    if (data.role !== "seller") {
      return res.status(400).json({ message: "Only seller will have access." });
    }
    let currUser = await db.query(
      `Select * from Sellers Where id = ${data.id};`
    );
    if (currUser[0].length === 0) {
      return res
        .status(400)
        .json({ message: "You are not logged in. Please login to get access" });
    }

    req.user = currUser[0][0];
    next();
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

module.exports = {
  auth,
  seller,
};
