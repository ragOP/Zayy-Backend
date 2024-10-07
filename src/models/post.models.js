const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    content: {
      type: String,
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
    isPool:{
      type: Boolean,
      default: false,
    },
    poolQuestion: {
      type: String,
    },
    poolAnswers: {
      type: Array,
    },
    likes:{
      type: Array,
      default: [],
    },
    votesOnFirstOption:{
      type: Array,
      default: [],
    },
    votesOnSecondOption:{
      type: Array,
      default: [],
    },
    totalVotes: {
      type: Number,
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
