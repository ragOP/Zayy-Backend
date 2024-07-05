const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  products: [
    {
      productId: { 
       type: mongoose.Schema.Types.ObjectId, required: true
      },
      quantity: {
        type: Number, required: true 
      },
      colorname: {
        type: String, required: true 
      },
      size: {
        type: String, required: true 
      },
      price: {
        type: Number, required: true 
      },
      shipping_charge: {
        type: Number, default: 0 
      },
    },
  ],
  address: {
    pincode: {
      type: String, required: true 
    },
    address: {
      type: String, required: true 
    },
    localty: {
      type: String, required: true 
    },
    city: {
      type: String, required: true 
    },
    state: {
      type: String, required: true 
    },
    type: {
      type: String, required: true 
    },
  },
  amount: {
    type: Number, required: true 
  },
  is_cod: {
    type: Boolean, default: false 
  },
  discount: {
    type: Number, required: true 
  },
  coupon: {
    type: String 
  },
  orderId: {
    type: String, required: true 
  },
  paymentId: {
    type: String, required: true 
  },
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
