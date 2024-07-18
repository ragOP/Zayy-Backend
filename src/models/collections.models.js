const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const collectionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    sellerId: {
     type: mongoose.Schema.Types.ObjectId,
     ref: "Seller",
     required: true,
    }
  },
  { timestamps: true }
);

const Collection = mongoose.model("Collection", collectionSchema);
module.exports = Collection;
