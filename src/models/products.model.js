const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    discount_type: {
      type: String,
      enum: ["percentage", "amount"],
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
      required: true,
    },
    instock: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    collection: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
