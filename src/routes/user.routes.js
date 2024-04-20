const express = require("express");
// const multer = require("multer");
// const { storage } = require("../utils/multer.utils");
const { auth } = require("../middlewares/protectedRoutes.middlewares");
// const upload = multer({ storage: storage });
const {
  handleGetAllBrand,
  handleGetAllBoutique,
  handleGetAllBrandNames,
  handleGetAllBoutiqueNames,
  handleGetBrandById,
  handleGetAllProducts,
  handleBanners,
  handleThumbnail,
  handleGetCategories,
} = require("../controllers/user.controllers");

const router = express.Router();

// Brands -->
router.route("/brands").get(auth, handleGetAllBrand);
router.route("/brandname").get(auth, handleGetAllBrandNames);
router.route("/brand/:id").get(auth, handleGetBrandById);

// Boutique -->
router.route("/boutiques").get(auth, handleGetAllBoutique);
router.route("/boutiquename").get(auth, handleGetAllBoutiqueNames);
router.route("/boutique/:id").get(auth, handleGetBrandById);

// Product -->
router.route("/products").post(auth, handleGetAllProducts);
router.route("/banners").get(auth, handleBanners);
router.route("/thumbnails").get(auth, handleThumbnail);
router.route("/lists").get(auth, handleGetCategories);

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
