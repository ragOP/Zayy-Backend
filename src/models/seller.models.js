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
  have_business: {
    type: Boolean,
    default: false,
  },
});

const Seller = mongoose.model("Seller", sellerSchema);

module.exports = Seller;
