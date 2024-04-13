import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      max: 200,
    },
    img: {
      type: String,
    },
    likes: {
      type: Array,
      default: [],
    },
    bookmarks: {
      type: Array,
      default: [],
    },
    reposts: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", PostSchema);

export default Post;
