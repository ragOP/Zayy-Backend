const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    required: true,
  },
  website: {
    type: String,
  },
  address: [
    {
      pincode: {
        type: Number,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      localty: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
    },
  ],
  bankDetails: [
    {
      account_no: {
        type: String,
        required: true,
      },
      ifsc_code: {
        type: String,
        required: true,
      },
      bank_name: {
        type: String,
        required: true,
      },
      branch_name: {
        type: String,
        required: true,
      },
      account_holder_name: {
        type: String,
        required: true,
      },
    },
  ],
  business_type: {
    type: String,
    enum: ["boutique", "brand"],
    required: true,
  },
});

const Seller = mongoose.model("Seller", sellerSchema);

module.exports = Seller;
