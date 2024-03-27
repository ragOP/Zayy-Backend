const express = require("express");
const multer = require("multer");
const { storage } = require("../utils/multer.utils");
const { handlecreateProduct } = require("../controllers/seller.controllers");
const { seller } = require("../middlewares/protectedRoutes.middlewares");

const router = express.Router();
const upload = multer({ storage: storage, array: "images", maxCount: 5 });

// Add New Product Route -->
router
  .route("/addProduct")
  .post(seller, upload.array("images"), handlecreateProduct);

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
