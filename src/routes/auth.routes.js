const express = require("express");
const {
  handleLoginAdmin,
  handleUserLogin,
  handleUserDetails,
  handleSellerRegister,
} = require("../controllers/auth.controllers");
const { auth } = require("../middlewares/protectedRoutes.middlewares");

const router = express.Router();

// Error handling middleware -->
router.use((err, req, res, next) => {
  if (err) {
    console.error("Error in auth middleware:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
  next();
});

// Admin Login Route -->
router.route("/admin/login").post(handleLoginAdmin);

// User Login Route -->
router.route("/login").post(handleUserLogin);
router.route("/addDetails").post(auth, handleUserDetails);

// Seller Login Route -->
router.route("/sellerRegister").post(handleSellerRegister);

module.exports = router;
