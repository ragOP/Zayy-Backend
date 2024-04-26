const Banner = require("../models/banner.models");
const Category = require("../models/categories.models");
const Product = require("../models/products.model");
const Seller = require("../models/seller.models");
const Thumbnail = require("../models/thumbnail.models");
// const cloudinary = require("../utils/cloudniary.utils");
// const fs = require("fs");

// Get All Brand Products based on category filter
exports.handleGetAllBrand = async (req, res) => {
  try {
    if (req.query.category) {
      let filter = {
        category: { $regex: req.query.category, $options: "i" },
      };
      const brands = await Seller.find({ business_type: "brand" });

      if (brands.length === 0) {
        return res.status(200).json({
          message: "No Result Found!",
          data: brands,
        });
      }
      return res.status(200).json({
        message: "Products fetched successfully for brand",
        data: brands,
      });
    } else {
      const brands = await Seller.find({ business_type: "brand" });
      if (brands.length === 0) {
        return res.status(200).json({
          message: "No Result Found!",
          data: brands,
        });
      }
      return res.status(200).json({
        message: "Products fetched successfully for brand",
        data: brands,
      });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error fetching products for brand sellers" });
  }
};

// Get All Brand Name Based On Search Filter
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
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching brand names" });
  }
};

// Get All Boutique Product based on category filter
exports.handleGetAllBoutique = async (req, res) => {
  try {
    if (req.query.category) {
      let filter = {
        category: { $regex: req.query.category, $options: "i" },
      };
      const brands = await Seller.find({ business_type: "boutique" });
      if (brands.length === 0) {
        return res.status(200).json({
          message: "No Result Found!",
          data: brands,
        });
      }
      return res.status(200).json({
        message: "Products fetched successfully for brand",
        data: brands,
      });
    } else {
      const brands = await Seller.find({ business_type: "boutique" });
      if (brands.length === 0) {
        return res.status(200).json({
          message: "No Result Found!",
          data: brands,
        });
      }
      return res.status(200).json({
        message: "Products fetched successfully for brand",
        data: brands,
      });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error fetching products for brand sellers" });
  }
};

// Get All Brand Name Based On search Filter
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
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error fetching boutique brand names" });
  }
};

// Get Brand or Boutique by id
exports.handleGetBrandById = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Seller.findById(id);
    if (!data) {
      return res.status(200).json({
        message: "No Matching Result Found!",
        data,
      });
    }
    return res.status(200).json({
      message: "Brand fetched successfully",
      data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching brand Category" });
  }
};

// Get Products based on filter and sorting
exports.handleGetAllProducts = async (req, res) => {
  try {
    let filters = {};
    let sellerfilter = {};
    let sorting = "";
    if (req.body.brand && req.body.brand.length > 0) {
      sellerfilter.name = Array.isArray(req.body.brand)
        ? { $in: req.body.brand }
        : req.body.brand;
    }
    if (req.body.business) {
      if (req.body.business === 1) {
        sellerfilter.business_type = "brand";
      }
      if (req.body.business === 2) {
        sellerfilter.business_type = "boutique";
      }
    }
    if (req.body.boutique && req.body.boutique.length > 0) {
      filters.boutique = Array.isArray(req.body.boutique)
        ? { $in: req.body.boutique }
        : req.body.boutique;
    }
    if (req.body.category && req.body.category.length > 0) {
      filters.category = Array.isArray(req.body.category)
        ? { $in: req.body.category }
        : req.body.category;
    }
    if (req.body.sorting) {
      if (req.body.sorting === "New") {
        sorting = { createdAt: -1 };
      }
      if (req.body.sorting === "Price HTL") {
        sorting = { price: -1 };
      }
      if (req.body.sorting === "Price LTH") {
        sorting = { price: 1 };
      }
    }
    const sellers = await Seller.find(sellerfilter);
    const sellerIds = sellers.map((seller) => seller._id);
    filters.createdBy = { $in: sellerIds };
    const products = await Product.find(filters).sort(sorting || {});

    if (products.length === 0) {
      return res.status(200).json({
        message: "No Result Found!",
        data: products,
      });
    }

    return res.status(200).json({
      message: "Fetched Successfully",
      data: products,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.handleBanners = async (req, res) => {
  try {
    const data = await Banner.find({});
    if (data.length === 0) {
      return res.status(404).json({ message: "No banners found." });
    }
    res.status(200).json({ message: "Fetched Successfully", data: data });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.handleThumbnail = async (req, res) => {
  try {
    const data = await Thumbnail.find({});
    if (data.length === 0) {
      return res.status(404).json({ message: "No banners found." });
    }
    res.status(200).json({ message: "Fetched Successfully", data: data });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.handleGetCategories = async (req, res) => {
  try {
    const data = await Category.find({});
    if (!data) {
      return res.send({ message: "No category found", data });
    }
    return res.send({ message: "All category fetched sucessfully", data });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.handleGetParticularProduct = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await Product.findById(id);
    if (!data) {
      return res.send({ message: "No category found", data });
    }
    return res.send({ message: "product fetched sucessfully", data });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
