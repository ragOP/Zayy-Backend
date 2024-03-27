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
    for (const file of req.files) {
      const uploadedImage = await cloudinary.upload(file.path);
      imageUrls.push(uploadedImage.secure_url);
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

const handleTT = (req, res) => {
  res.send("Hello");
};

module.exports = {
  handlecreateProduct,
  handleTT,
};
