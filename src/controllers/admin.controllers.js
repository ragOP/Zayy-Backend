const Product = require("../models/products.model");
const Seller = require("../models/seller.models");
const User = require("../models/users.models");

// Get All Products -->
const handleGetAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No approved products found" });
    }
    return res
      .status(200)
      .json({ message: "All approved product fetched", products });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "err " + error });
  }
};

// Get All Pending Products -->
const handleGetAllPendingProducts = async (req, res) => {
  try {
    const products = await Product.find({ status: "pending" }).sort({
      createdAt: "desc",
    });
    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No pending products found" });
    }
    return res
      .status(200)
      .json({ message: "All pending product fetched", products });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "err " + error });
  }
};

// Aprrove The Products -->
const handleApproveProduct = async (req, res) => {
  const id = req.params.id;
  try {
    let product = Product.findById(id);
    if (!product)
      return res
        .status(200)
        .json({ message: "No product found matching the id" });
    product = await Product.findByIdAndUpdate(
      id,
      { status: "approved" },
      { new: true }
    );
    return res
      .status(200)
      .json({ message: `${product.name}'s status updtaed `, product });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "err " + error });
  }
};

// Get All Users -->
const handleGetAllUsers = async (req, res) => {
  try {
    let users = await User.find({});
    if (!users) return res.send({ message: "No user found" });
    return res
      .status(200)
      .json({ message: "All user fetched successfully", users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "err " + error });
  }
};

// Get All Seller -->
const handleGetAllSeller = async (req, res) => {
  const { business_type } = req.body;
  try {
    const sellers = await Seller.find({ business_type });
    if (sellers.length < 1) {
      return res.status(404).json({ message: "No seller found" });
    }
    return res
      .status(200)
      .json({ message: `All ${business_type} fetched successfully`, sellers });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "err " + error });
  }
};

const handlegetAll = async (req, res) => {
  try {
    const sellers = await Seller.find({});
    if (sellers.length < 1) {
      return res.status(404).json({ message: "No seller found" });
    }
    return res
      .status(200)
      .json({ message: "All sellers fetched successfully", sellers });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "err " + error });
  }
};

// Get Specific product -->
const handleGetSpecificProduct = async (req, res) => {
  const id = req.params.id;
  try {
    const product = await Product.find({ _id: id });
    if (!product)
      return res.status(404).json({ message: "Product Not Found!" });
    return res.status(200).json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "err " + error });
  }
};

module.exports = {
  handleGetAllProducts,
  handleGetAllPendingProducts,
  handleApproveProduct,
  handleGetAllUsers,
  handleGetAllSeller,
  handleGetSpecificProduct,
  handlegetAll,
};
