const express = require("express");
const {
  handleGetAllProducts,
  handleGetAllPendingProducts,
} = require("../controllers/admin.controllers");
const { admin } = require("../middlewares/protectedRoutes.middlewares");

const router = express.Router();

// Admin Login Route -->
router.route("/getAllProducts").get(admin, handleGetAllProducts);
router.route("/getAllPendingProducts").get(admin, handleGetAllPendingProducts);

// Error handling middleware -->
router.use((err, req, res, next) => {
  console.error("Error in request:", err);
  res.status(500).json({ message: "Internal server error" });
});

module.exports = router;
