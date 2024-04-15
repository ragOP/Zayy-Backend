const Product = require("../models/products.model");
const Seller = require("../models/seller.models");

// Get All Brand Products
exports.handleGetAllBrandProduct = async (req, res) => {
  try {
    const brands = await Seller.find({ business_type: "brand" });
    const brandIds = brands.map((brand) => brand._id);
    const products = await Product.find({ createdBy: { $in: brandIds } }).sort({
      name: -1,
    });
    if (products.length === 0) {
      return res.status(200).json({
        message: "No Result Found!",
        data: products,
      });
    }
    return res.status(200).json({
      message: "Products fetched successfully for brand",
      data: products,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Error fetching products for brand sellers" });
  }
};

// Get All Brand Name Based On Filter
exports.handleGetAllBrandNames = async (req, res) => {
  try {
    let filter = { business_type: "brand" };
    if (req.query.search) {
      filter = {
        ...filter,
        name: { $regex: req.query.search, $options: "i" },
      };
    }

    const brands = await Seller.find(filter).select("name");

    if (brands.length === 0) {
      return res.status(200).json({
        message: "No Matching Result Found!",
        data: brands,
      });
    }
    return res.status(200).json({
      message: "Brand names fetched successfully",
      data: brands,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Error fetching boutique brand names" });
  }
};

// Get All Boutique Product
exports.handleGetAllBoutiqueProduct = async (req, res) => {
  try {
    const brands = await Seller.find({ business_type: "boutique" });
    const brandIds = brands.map((brand) => brand._id);
    const products = await Product.find({ createdBy: { $in: brandIds } }).sort({
      name: -1,
    });
    if (products.length === 0) {
      return res.status(200).json({
        message: "No Result Found!",
        data: products,
      });
    }
    return res.status(200).json({
      message: "Products fetched successfully for brand",
      data: products,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Error fetching products for brand sellers" });
  }
};

// Get All Boutique Name Based On Filter
exports.handleGetAllBoutiqueNames = async (req, res) => {
  try {
    let filter = { business_type: "boutique" };
    if (req.query.search) {
      filter = {
        ...filter,
        name: { $regex: req.query.search, $options: "i" },
      };
    }

    const brands = await Seller.find(filter).select("name");

    if (brands.length === 0) {
      return res.status(200).json({
        message: "No Matching Result Found!",
        data: brands,
      });
    }
    return res.status(200).json({
      message: "Brand names fetched successfully",
      data: brands,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Error fetching boutique brand names" });
  }
};
