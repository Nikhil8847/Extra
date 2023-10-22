const Post = require("../models/Post");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const User = require("../models/User");
const { checkValidUserAccess, checkPermissions } = require("../utils");

const getAllPosts = async (req, res) => {
  const posts = await Post.find({})
    .populate({ path: "author", select: "-password" })
    .populate({ path: "category", select: "title slug" });
  if (!posts) {
    throw new CustomError.NotFoundError("There are no posts");
  }
  console.log(posts);
  res.status(StatusCodes.OK).json({
    data: posts,
    length: posts.length,
  });
};

const createPost = async (req, res) => {
  // const task = await Post.create()
  const { _id } = req.user;
  req.body.author = _id;
  console.log(req.body);
  const post = await Post.create(req.body);
  console.log(post);
  // add this post to the user's posts array
  await User.findByIdAndUpdate(
    _id,
    { $addToSet: { posts: post._id } },
    { new: true }
  );
  res.status(StatusCodes.CREATED).json({ data: post });
};

const updatePost = async (req, res) => {
  const { id } = req.params;
  let post = await Post.findById(id).select("author");
  checkValidUserAccess(req.user, post.author);
  post = await Post.findByIdAndUpdate(id, req.body).select(
    "_id title content author"
  );

  res.status(StatusCodes.OK).json({
    msg: "The post is updated",
    data: post,
  });
};

const deletePost = async (req, res) => {
  const { id } = req.params;
  let post = Post.findById(id).select("author");
  checkPermissions(req.user, post.author);
  post = await Post.findByIdAndDelete(id);

  res.status(StatusCodes.NO_CONTENT).json({
    msg: "Post is deleted",
    data: post,
  });
};
// Liking a post
const liked = async (req, res) => {
  console.log(req.params);
  const { id } = req.params;

  // Post which is being liked
  let post = await Post.findById(id);
  if (!post) {
    throw new CustomError.NotFoundError(`Post doesn't exist`);
  }

  // User who is liking the post
  const isAlreadyLiked = post.likes.find(
    (userAlreadyLiked) =>
      userAlreadyLiked._id.toString() === req.user._id.toString()
  );
  if (isAlreadyLiked) {
    throw new CustomError.BadRequestError("Already liked this post");
  }

  // Add liked post to users likes
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { likes: post._id } },
    { new: true }
  );

  // add likers to post likes array
  post = await Post.findByIdAndDelete(
    post._id,
    { $addToSet: { likes: user._id } },
    { new: true }
  );

  res.send(StatusCodes.OK).json({
    data: "post liked",
  });
};

// Unliking a post
const unliked = async (req, res) => {
  const { id } = req.params.Id;

  // Post which is being unliked
  let post = await Post.findById(id);
  if (!post) {
    throw new CustomError.NotFoundError(`Post doesn't exist`);
  }

  // User who is liking the post

  const isAlreadyLiked = post.likes.find(
    (userAlreadyLiked) =>
      userAlreadyLiked._id.toString() === req.user._id.toString()
  );
  if (!isAlreadyLiked) {
    throw new CustomError.BadRequestError("You haven't liked this post");
  }

  // Add liked post to users likes
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $pull: { likes: post._id } },
    { new: true }
  );

  // add likers to post likes array
  post = await Post.findByIdAndDelete(
    post._id,
    { $pull: { likes: user._id } },
    { new: true }
  );

  res.send(StatusCodes.OK).json({
    data: "post unliked",
  });
};


const getPost = async (req, res) => {
  const {id: postId} = req.params;
  const post = await Post.findById(postId)
  .populate({path:"author", select: "-password"}).populate({path:"category", select: "_id title slug"}).populate("likes");

  if(!post){
    throw new CustomError.NotFoundError("Post not found");
  }

  res.status(StatusCodes.OK).json({
    data: post
  })

}

module.exports = {
  createPost,
  liked,
  getAllPosts,
  unliked,
  updatePost,
  deletePost,
  getPost
};
