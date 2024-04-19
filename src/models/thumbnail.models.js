const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const thumbanailSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Thumbnail = mongoose.model("Thumbnail", thumbanailSchema);
module.exports = Thumbnail;
