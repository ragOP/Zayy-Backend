const Product = require("../models/products.model");
const cloudinary = require("../utils/cloudniary.utils");

// Adding New Product -->
const handlecreateProduct = async (req, res) => {
  try {
    const id = req.user.id;
    const {
      name,
      price,
      discount,
      discount_type,
      salesprice,
      onsale,
      totalstock,
      instock,
      category,
      type,
    } = req.body;
    const imageUrls = [];
    console.log(req.files);
    try {
      for (const file of req.files) {
        const uploadedImage = await cloudinary.upload(file.path);
        imageUrls.push(uploadedImage.secure_url);
      }
    } catch (error) {
      console.error("Error uploading images:", error);
    }
    const product = await Product.create({
      name,
      price,
      discount,
      discount_type,
      salesprice,
      onsale,
      totalstock,
      instock,
      category,
      type,
      images: imageUrls,
      createdBy: id,
      status: "pending",
    });
    res.status(201).json({ message: "Product created successfully", product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  handlecreateProduct,
};
