const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: false,
    trim: [true, "title is required"],
  },
  content: {
    unique: false,
    type: String,
    required: [true, "content is required"],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: [true, "Author is required"],
  },
  tags: [
    {
      type: String,
      trim: true,
    },
  ],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "post category is required"],
    trim: true,
  },
  coverImage: {
    unique: false,
    type: String, // URL or file path to the post's cover image
  },
  createdAt: {
    type: Date,
    unique: false,
    default: Date.now,
  },
  updatedAt: {
    unique: false,
    type: Date,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  isPublished: {
    type: Boolean,
    unique: false,
    default: false,
  },
  publishedAt: {
    unique: false,
    type: Date,
  },
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
