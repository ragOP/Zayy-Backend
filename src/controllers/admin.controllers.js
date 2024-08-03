const Banner = require("../models/banner.models");
const Order = require("../models/order.models");
const Product = require("../models/products.model");
const Seller = require("../models/seller.models");
const Thumbnail = require("../models/thumbnail.models");
const User = require("../models/users.models");
const Cart = require("../models/cart.models");
const Wishlist = require("../models/wishlist.models");
const cloudinary = require("../utils/cloudniary.utils");
const fs = require("fs");
const Category = require("../models/categories.models");

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
    const sellers = await Seller.find({ business_type }).select("-password");
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

// Post Thumbnail
const handlePostThumbnail = async (req, res) => {
  try {
    const { name, brandId, type } = req.body;

    let logoUrl = "";
    if (req.file) {
      const logoUrlResponse = await cloudinary.uploader.upload(req.file.path);
      logoUrl = logoUrlResponse.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const data = await Thumbnail.create({
      name,
      brandId,
      type,
      image: logoUrl,
    });
    res
      .status(201)
      .json({ message: "Thumbnail created successfully", data: data });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Post Banner
const handlePostBanners = async (req, res) => {
  try {
    const { name, brandId } = req.body;

    let logoUrl = "";
    if (req.file) {
      const logoUrlResponse = await cloudinary.uploader.upload(req.file.path);
      logoUrl = logoUrlResponse.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const data = await Banner.create({
      name,
      brandId,
      image: logoUrl,
    });
    res
      .status(201)
      .json({ message: "Banner created successfully", data: data });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const handleGetAllOrders = async (req, res) => {
  try {
    const orders =  await Order.find({});
    if(orders.length < 1){
      return res.status(404).json({message: "No Orders Found"});
    }
    return res.status(200).json({orders, message: "All Ordes Fetched Successfully!"})
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

const handleGetUserCart = async (req, res) => {
  const id = req.params.id;

  try {
    const data = await Cart.find({userId: id});
    if(data.length === 0){
      return res.status(404).json({data: [], message: "No cart item found"})
    }

    const productIds = data.map(items => items.productId);

    const products = await Product.find({_id: {$in: productIds}});

    if(products.length < 1){
      return res.send({data: [], message: "No Product Found!"});
    }

    const productMap = new Map();
    products.forEach(product => {
      productMap.set(product._id.toString(), product);
    });


    const updatedData = data.map((items) => {
      const product = productMap.get(items.productId.toString());
      return {
          ...product.toObject(),
          size: items.size,  
          color: items.colorname,
      }
    })

    return res.status(200).json({data: updatedData, message: "Cart items fetched successfully"})
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

const handleGetUserWishlist = async (req, res) => {
  const id = req.params.id;

  try {
    const data = await Wishlist.find({userId: id});
    if(data.length === 0){
      return res.status(404).json({data: [], message: "No cart item found"})
    }

    const productIds = data.map(items => items.productId);

    const products = await Product.find({_id: {$in: productIds}});

    if(products.length < 1){
      return res.send({data: [], message: "No Product Found!"});
    }
    return res.status(200).json({data: products, message: "Wislist items fetched successfully"})
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

const handleAddCategory = async (req, res) => {
  const { name, sub_categories } = req.body;
  try {
    const category = await Category.findOne({name});
    if(category) return res.status(409).json({'message': 'Category already found'});

    let imgUrl = "";
    if (req.file) {
      const logoUrlResponse = await cloudinary.uploader.upload(req.file.path);
      imgUrl = logoUrlResponse.secure_url;
      fs.unlinkSync(req.file.path);
    }
    const newCategory = await Category.create({
      name,
      sub_categories,
      image: imgUrl
    });
    return res.status(201).json({data: newCategory, message: "Category Added"});
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

module.exports = {
  handleGetAllProducts,
  handleGetAllPendingProducts,
  handleApproveProduct,
  handleGetAllUsers,
  handleGetAllSeller,
  handleGetSpecificProduct,
  handlegetAll,
  handlePostBanners,
  handlePostThumbnail,
  handleGetAllOrders,
  handleGetUserCart,
  handleGetUserWishlist,
  handleAddCategory
};
