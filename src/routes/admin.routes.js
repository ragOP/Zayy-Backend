const express = require("express");
const multer = require("multer");
const { storage } = require("../utils/multer.utils");
const {
  handleGetAllProducts,
  handleGetAllPendingProducts,
  handleApproveProduct,
  handleGetAllUsers,
  handleGetAllSeller,
  handleGetSpecificProduct,
  handlePostBanners,
  handlePostThumbnail,
  handlegetAll,
  handleGetAllOrders
} = require("../controllers/admin.controllers");
const { admin } = require("../middlewares/protectedRoutes.middlewares");

const router = express.Router();
const upload = multer({ storage: storage });

// Get all product route -->
router.route("/getAllProducts").get(admin, handleGetAllProducts);

// Get all approved pending route -->
router.route("/getAllPendingProducts").get(admin, handleGetAllPendingProducts);

// Update status of product -->
router.route("/approveProduct/:id").patch(admin, handleApproveProduct);

// Get all users -->
router.route("/getAllUser").get(admin, handleGetAllUsers);

// Get all seller -->
router
  .route("/getAllSeller")
  .post(admin, handleGetAllSeller)
  .get(admin, handlegetAll);

// Get Specific Post -->
router.route("/getProduct/:id").get(admin, handleGetSpecificProduct);

router.route("/banners").post(upload.single("image"), admin, handlePostBanners);
router
  .route("/thumbnails")
  .post(upload.single("image"), admin, handlePostThumbnail);

router.route("/getAllOrders").get(admin, handleGetAllOrders);

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
