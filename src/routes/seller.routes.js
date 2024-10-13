const express = require("express");
const multer = require("multer");
const { storage } = require("../utils/multer.utils");
const {
  handlecreateProduct,
  handlePostCollection,
  handleGetCollection,
  handleGetAllUnapprovedProduct,
  handleGetAllApprovedProduct,
  handleAddToCollection,
  handleGetPendingOrders,
  handleGetCancelledOrders,
  handlePostCancelledOrders,
  handleGetApprovedOrders,
  handleAddPost,
  handleGetAllPosts
} = require("../controllers/seller.controllers");
const { seller } = require("../middlewares/protectedRoutes.middlewares");

const router = express.Router();
const upload = multer({ storage: storage });

// Add New Product Route -->
router
  .route("/addProduct")
  .post(seller, upload.array("images", 5), handlecreateProduct);

router.route("/getAllProducts").get(seller, handleGetAllApprovedProduct);

router.route("/collection").post(seller, upload.single("image"), handlePostCollection).get(seller, handleGetCollection)

router.route("/getAllPendingProduct").get(seller, handleGetAllUnapprovedProduct);

router.route("/addToColllection").post(seller, handleAddToCollection);

router.route("/pendingOrders").get(seller, handleGetPendingOrders);

router.route("/approvedOrders").get(seller, handleGetApprovedOrders);

router.route("/cancelOrder").get(seller, handleGetCancelledOrders).post(seller, handlePostCancelledOrders);

router.route("/addPost").post(seller, upload.single("image"), handleAddPost);

router.route("/getAllPosts").get(seller, handleGetAllPosts);


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
