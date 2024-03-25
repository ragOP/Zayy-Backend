const express = require("express");
const multer = require("multer");
const { storage } = require("../utils/multer.utils");
const {
  handleLoginAdmin,
  handleUserLogin,
  handleUserDetails,
  handleSellerRegister,
  handleSellerLogin,
} = require("../controllers/auth.controllers");
const { auth } = require("../middlewares/protectedRoutes.middlewares");

const router = express.Router();
const upload = multer({ storage: storage });

// Admin Login Route -->
router.route("/admin/login").post(handleLoginAdmin);

// User Login Route -->
router.route("/login").post(handleUserLogin);
router.route("/addDetails").post(auth, handleUserDetails);

// Seller Login Route -->
router
  .route("/sellerRegister")
  .post(upload.single("logo"), handleSellerRegister);
router.route("/sellerlogin").post(handleSellerLogin);

// Error handling middleware
router.use((err, req, res, next) => {
  console.error("Error in request:", err);
  if (err instanceof multer.MulterError) {
    return res
      .status(400)
      .json({ message: "File upload error: " + err.message });
  }
  res.status(500).json({ message: "Internal server error" });
});

module.exports = router;
