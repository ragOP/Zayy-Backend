const express = require("express");
const {
  handleLoginAdmin,
  handleUserLogin,
} = require("../controllers/auth.controllers");

const router = express.Router();

// Admin Login Route -->
router.route("/admin/login").post(handleLoginAdmin);

// User Login Route -->
router.route("/login").post(handleUserLogin);

module.exports = router;
