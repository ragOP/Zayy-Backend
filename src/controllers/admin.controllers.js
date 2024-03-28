const Product = require("../models/products.model");

const handleGetAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }
    return res.send({ message: "All Product Fetched", products });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "err " + error });
  }
};

const handleGetAllPendingProducts = (req, res) => {};

module.exports = {
  handleGetAllProducts,
  handleGetAllPendingProducts,
};
