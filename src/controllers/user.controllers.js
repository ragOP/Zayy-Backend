const Product = require("../models/products.model");
const Seller = require("../models/seller.models");

exports.handleGetAllBrandProduct = async (req, res) => {
  try {
    const brands = await Seller.find({ business_type: "brand" });
    const brandIds = brands.map((brand) => brand._id);
    const products = await Product.find({ createdBy: { $in: brandIds } }).sort({
      name: -1,
    });
    res.status(200).json({
      message: "Products fetched successfully for brand",
      data: products,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error fetching products for brand sellers" });
  }
};

exports.handleGetAllBoutiqueProduct = async (req, res) => {
  try {
    const brands = await Seller.find({ business_type: "boutique" });
    const brandIds = brands.map((brand) => brand._id);
    const products = await Product.find({ createdBy: { $in: brandIds } }).sort({
      name: -1,
    });
    res.status(200).json({
      message: "Products fetched successfully for brand",
      data: products,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error fetching products for brand sellers" });
  }
};
