const express = require("express");
const multer = require("multer");
const { storage } = require("../utils/multer.utils");
const {
  handlecreateProduct,
  handleGetProducts,
} = require("../controllers/seller.controllers");
const { seller } = require("../middlewares/protectedRoutes.middlewares");

const router = express.Router();
const upload = multer({ storage: storage });

// Add New Product Route -->
router
  .route("/addProduct")
  .post(seller, upload.array("images", 5), handlecreateProduct);

router.route("/getAllProducts").get(seller, handleGetProducts);

// Error handling middleware -->
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
