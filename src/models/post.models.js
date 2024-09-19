const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    caption: {
      type: String,
      required: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    likeCount: {
     type: String,
     default: 0,
    },
    comments: [
     {
       type: mongoose.Schema.Types.ObjectId,
       ref: "Comment",
     },
   ],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
