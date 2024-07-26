const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  name: {
    type: String,
  },
  logo: {
    type: String,
  },
  website: {
    type: String,
  },
  pincode: {
    type: Number,
  },
  address: {
    type: String,
  },
  localty: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  country: {
    type: String,
  },
  account_no: {
    type: String,
  },
  ifsc_code: {
    type: String,
  },
  bank_name: {
    type: String,
  },
  branch_name: {
    type: String,
  },
  account_holder_name: {
    type: String,
  },
  business_type: {
    type: String,
  },
  upi:{
    type: String,
  },
  description:{
    type: String,
  }
},  {timestamps: true});

const Seller = mongoose.model("Seller", sellerSchema);

module.exports = Seller;
