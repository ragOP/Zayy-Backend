const Collection = require("../models/collections.models");
const Order = require("../models/order.models");
const Post = require("../models/post.models");
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
    let collection = await Collection.find({ name: name });
    if (collection.length > 1) {
      return res.status(409).json({ message: "Name Already Exist" });
    }
    collection = await Collection.create({
      name,
      sellerId: id,
      image: logoUrl,
    });
    return res.status(201).json({ message: "Collection Created Sucessfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "err " + error });
  }
};

const handleGetCollection = async (req, res) => {
  const { id } = req.user;
  try {
    const collection = await Collection.find({ sellerId: id });
    if (collection.length < 1) {
      return res.status(404).json({ message: "No Collection Found" });
    }
    return res
      .status(200)
      .json({ collection, message: "Collection Fetched Succesfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "err " + error });
  }
};

const handleGetAllApprovedProduct = async (req, res) => {
  const { id } = req.user;
  try {
    const data = await Product.find({ createdBy: id, status: "approved" });
    if (data.length < 1) {
      return res.status(404).json({ message: "No Data Found" });
    }
    return res
      .status(200)
      .json({ message: "Product Fetched Sucessfully", data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "err " + error });
  }
};

const handleGetAllUnapprovedProduct = async (req, res) => {
  const { id } = req.user;
  try {
    const data = await Product.find({ createdBy: id, status: "pending" });
    if (data.length < 1) {
      return res.status(404).json({ message: "No Data Found" });
    }
    return res
      .status(200)
      .json({ message: "Product Fetched Sucessfully", data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "err " + error });
  }
};

const handleAddToCollection = async (req, res) => {
  const { name, product } = req.body;
  try {
    const products = await Product.find({ _id: { $in: product } });
    if (products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found matching the provided IDs" });
    }

    for (const product of products) {
      await Product.findByIdAndUpdate(
        product._id,
        { $addToSet: { collectionArray: name } },
        { new: true }
      );
    }
    res.status(200).json({ message: "Collection updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "err " + error });
  }
};

const handleGetPendingOrders = async (req, res) => {
  const { id } = req.user;
  try {
    const sellerProducts = await Product.find({
      createdBy: id,
      status: "approved",
    });

    if (sellerProducts.length === 0) {
      return res
        .status(404)
        .json({ data: [], message: "Add products to get orders" });
    }

    const sellerProductIds = sellerProducts.map((product) => product._id);

    const data = await Order.aggregate([
      {
        $match: {
          status: "pending",
        },
      },
      {
        $unwind: "$products",
      },
      {
        $match: {
          "products.productId": { $in: sellerProductIds },
        },
      },
      {
        $group: {
          _id: "$_id",
          products: { $push: "$products" },
          address: { $first: "$address" },
          user: { $first: "$user" },
          amount: { $first: "$amount" },
          is_cod: { $first: "$is_cod" },
          discount: { $first: "$discount" },
          coupon: { $first: "$coupon" },
          orderId: { $first: "$orderId" },
          status: { $first: "$status" },
          paymentId: { $first: "$paymentId" },
          __v: { $first: "$__v" },
        },
      },
    ]);

    if (data.length === 0) {
      return res
        .status(404)
        .json({ data: [], message: "No cancelled orders found." });
    }

    const productIds = data.flatMap((order) =>
      order.products.map((p) => p.productId.toString())
    );

    const products = await Product.find({ _id: { $in: productIds } });

    const response = data.map((order) => {
      const detailedProducts = order.products.map((p) => {
        const productDetail = products.find(
          (prod) => prod._id.toString() === p.productId.toString()
        );
        return { ...p, productDetail };
      });
      return { ...order, products: detailedProducts };
    });

    return res
      .status(200)
      .json({ data: response, message: "Orders Fetched Successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "err " + error });
  }
};

const handleGetCancelledOrders = async (req, res) => {
  const { id } = req.user;
  try {
    const sellerProducts = await Product.find({
      createdBy: id,
      status: "approved",
    });

    if (sellerProducts.length === 0) {
      return res
        .status(404)
        .json({ data: [], message: "Add products to get orders" });
    }
    const sellerProductIds = sellerProducts.map((product) => product._id);

    const data = await Order.aggregate([
      {
        $match: {
          status: "rejected",
        },
      },
      {
        $unwind: "$products",
      },
      {
        $match: {
          "products.productId": { $in: sellerProductIds },
        },
      },
      {
        $group: {
          _id: "$_id",
          products: { $push: "$products" },
          address: { $first: "$address" },
          user: { $first: "$user" },
          amount: { $first: "$amount" },
          is_cod: { $first: "$is_cod" },
          discount: { $first: "$discount" },
          coupon: { $first: "$coupon" },
          orderId: { $first: "$orderId" },
          status: { $first: "$status" },
          paymentId: { $first: "$paymentId" },
          __v: { $first: "$__v" },
        },
      },
    ]);

    if (data.length === 0) {
      return res
        .status(404)
        .json({ data: [], message: "No cancelled orders found." });
    }

    const productIds = data.flatMap((order) =>
      order.products.map((p) => p.productId.toString())
    );

    const products = await Product.find({ _id: { $in: productIds } });

    const response = data.map((order) => {
      const detailedProducts = order.products.map((p) => {
        const productDetail = products.find(
          (prod) => prod._id.toString() === p.productId.toString()
        );
        return { ...p, productDetail };
      });
      return { ...order, products: detailedProducts };
    });

    return res
      .status(200)
      .json({ data: response, message: "Orders Fetched Successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "err " + error });
  }
};

const handlePostCancelledOrders = async (req, res) => {
  const { orderId } = req.body;

  try {
    const data = await Order.findByIdAndUpdate(
      { _id: orderId },
      { $set: { status: "rejected" } },
      { new: true }
    );
    if (data.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }
    return res.status(200).json({
      data,
      message: "Order status updated to rejected successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "err " + error });
  }
};

const handleGetApprovedOrders = async (req, res) => {
  const { id } = req.user;
  try {
    const sellerProducts = await Product.find({
      createdBy: id,
      status: "approved",
    });

    if (sellerProducts.length === 0) {
      return res
        .status(404)
        .json({ data: [], message: "Add products to get orders" });
    }

    const sellerProductIds = sellerProducts.map((product) => product._id);

    const data = await Order.aggregate([
      {
        $match: {
          status: "approved",
        },
      },
      {
        $unwind: "$products",
      },
      {
        $match: {
          "products.productId": { $in: sellerProductIds },
        },
      },
      {
        $group: {
          _id: "$_id",
          products: { $push: "$products" },
          address: { $first: "$address" },
          user: { $first: "$user" },
          amount: { $first: "$amount" },
          is_cod: { $first: "$is_cod" },
          discount: { $first: "$discount" },
          coupon: { $first: "$coupon" },
          orderId: { $first: "$orderId" },
          status: { $first: "$status" },
          paymentId: { $first: "$paymentId" },
          __v: { $first: "$__v" },
        },
      },
    ]);

    if (data.length === 0) {
      return res
        .status(404)
        .json({ data: [], message: "No cancelled orders found." });
    }

    const productIds = data.flatMap((order) =>
      order.products.map((p) => p.productId.toString())
    );

    const products = await Product.find({ _id: { $in: productIds } });

    const response = data.map((order) => {
      const detailedProducts = order.products.map((p) => {
        const productDetail = products.find(
          (prod) => prod._id.toString() === p.productId.toString()
        );
        return { ...p, productDetail };
      });
      return { ...order, products: detailedProducts };
    });

    return res
      .status(200)
      .json({ data: response, message: "Orders Fetched Successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "err " + error });
  }
};

const handleAddPost = async (req, res) => {
  const { content, isPool, poolQuestion, poolAnswerFirst, poolAnswerSecond } =
    req.body;
  const { id } = req.user;
  try {
    let imgUrl = "";
    let answers = [];
    if (req.file) {
      const imgUrlResponse = await cloudinary.uploader.upload(req.file.path);
      imgUrl = imgUrlResponse.secure_url;
      fs.unlinkSync(req.file.path);
    }
    if (isPool) {
      answers = [poolAnswerFirst, poolAnswerSecond];
      await Post.create({
        content,
        sellerId: id,
        image: imgUrl,
        poolQuestion,
        poolAnswers: answers,
        isPool,
      });
    } else {
      await Post.create({
        sellerId: id,
        content,
        image: imgUrl,
      });
    }
    return res.status(200).json({ message: "Post Added Successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "err " + error });
  }
};

const handleGetAllPosts = async (req, res) => {
  try {
    const { id } = req.user;

    const posts = await Post.find({ sellerId: id })
      .sort({ createdAt: -1 })
      .populate({
        path: "comments",
        populate: {
          path: "userId",
          select: "name",
        },
      });

    return res
      .status(200)
      .json({ data: posts, total: posts.length, message: "All post fetched" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "err " + error });
  }
};

module.exports = {
  handlecreateProduct,
  handlePostCollection,
  handleGetCollection,
  handleGetAllApprovedProduct,
  handleGetAllUnapprovedProduct,
  handleAddToCollection,
  handleGetPendingOrders,
  handleGetCancelledOrders,
  handlePostCancelledOrders,
  handleGetApprovedOrders,
  handleAddPost,
  handleGetAllPosts,
};
