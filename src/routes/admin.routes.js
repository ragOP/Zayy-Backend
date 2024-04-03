const express = require("express");
const {
  handleGetAllProducts,
  handleGetAllPendingProducts,
  handleApproveProduct,
  handleGetAllUsers,
  handleGetAllSeller,
  handleGetSpecificProduct,
} = require("../controllers/admin.controllers");
const { admin } = require("../middlewares/protectedRoutes.middlewares");

const router = express.Router();

// Get all product route -->
router.route("/getAllProducts").get(admin, handleGetAllProducts);

// Get all approved pending route -->
router.route("/getAllPendingProducts").get(admin, handleGetAllPendingProducts);

// Update status of product -->
router.route("/approveProduct/:id").patch(admin, handleApproveProduct);

// Get all users -->
router.route("/getAllUser").get(admin, handleGetAllUsers);

// Get all seller -->
router.route("/getAllSeller").post(admin, handleGetAllSeller);

// Get Specific Post -->
router.route("/getProduct/:id").get(admin, handleGetSpecificProduct);

// Error handling middleware -->
router.use((err, req, res, next) => {
  console.error("Error in request:", err);
  res.status(500).json({ message: "Internal server error" });
});

module.exports = router;
