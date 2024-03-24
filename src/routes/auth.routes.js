const express = require("express");
const {
  handleLoginAdmin,
  handleUserLogin,
  handleUserDetails,
} = require("../controllers/auth.controllers");
const { auth } = require("../middlewares/protectedRoutes.middlewares");

const router = express.Router();

// Admin Login Route -->
router.route("/admin/login").post(handleLoginAdmin);

// User Login Route -->
router.route("/login").post(handleUserLogin);
router.route("/addDetails").post(auth, handleUserDetails);

// Seller Login Route -->

module.exports = router;
