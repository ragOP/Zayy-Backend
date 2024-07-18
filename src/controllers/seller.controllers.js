const Collection = require("../models/collections.models");
const Product = require("../models/products.model");
const cloudinary = require("../utils/cloudniary.utils");
const fs = require("fs");

// Adding New Product -->
const handlecreateProduct = async (req, res) => {
  try {
    const id = req.user.id;
    const {
      name,
      price,
      discount,
      description,
      discount_type,
      salesprice,
      onsale,
      totalstock,
      instock,
      category,
      type,
      color,
      size,
    } = req.body;

    const imageUrls = [];
    if (req.files) {
      for (const file of req.files) {
        const uploadedImage = await cloudinary.uploader.upload(file.path);
        fs.unlinkSync(file.path);
        imageUrls.push(uploadedImage.secure_url);
      }
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
      description,
      color,
      size,
      createdBy: id,
      status: "pending",
    });
    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "err " + error });
  }
};

const handleGetProducts = async (req, res) => {
  try {
    const id = req.user.id;
    const products = await Product.find({ createdBy: id });
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "err " + error });
  }
};

const handlePostCollection = async (req, res) => {
  const { name } = req.body;
  const { id } = req.user;

  let logoUrl = "";
  if (req.file) {
    const logoUrlResponse = await cloudinary.uploader.upload(req.file.path);
    logoUrl = logoUrlResponse.secure_url;
    fs.unlinkSync(req.file.path);
  }

  try {
    const collection = await Collection.find({name: name});
    if(collection.length > 1){
      return res.status(409).json({message: "Name Already Exist"});
    }
    collection = await Collection.create({
      name,
      sellerId: id,
      image: logoUrl
    })
    return res.status(201).json({message: "Collection Created Sucessfully"});
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "err " + error });
  }
}

module.exports = {
  handlecreateProduct,
  handleGetProducts,
  handlePostCollection,
};
