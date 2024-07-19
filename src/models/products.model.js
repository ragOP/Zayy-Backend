const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
    },
    discount: {
      type: Number,
      default: 0,
    },
    discount_type: {
      type: String,
      default: "percentage",
    },
    salesprice: {
      type: Number,
      default: 0,
    },
    onsale: {
      type: Boolean,
      default: false,
    },
    totalstock: {
      type: Number,
    },
    instock: {
      type: Number,
    },
    category: {
      type: String,
    },
    type: {
      type: String,
    },
    images: [
      {
        type: String,
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
    status: {
      type: String,
      default: "pending",
    },
    color: [
      {
        type: String,
      },
    ],
    size: [
      {
        type: String,
      },
    ],
    collectionArray: [
      {
        type: String,
      }
    ]
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
