const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const {
  createTokenUser,
  attachCookiesToResponse,
  checkPermissions,
  userNotOperatingOnItself,
} = require("../utils");
const { deleteUserFromDB } = require("../utils/UserUtils");
const { uploadToCloudinary } = require("../config/cloudinary");
const Post = require("../models/Post");

const createUser = async (req, res) => {
  const user = await Model.create(req.body);
  const tokenUser = createTokenUser(user);
  res.status(StatusCodes.CREATED).send({ user: tokenUser });
};

const deleteAccount = async (req, res) => {
  const { _id } = req.user;
  await deleteUserFromDB(_id);
  res
    .status(StatusCodes.NO_CONTENT)
    .send({ data: "Account Delete Successfully" });
};

const deleteUser = async (req, res) => {
  const _id = req.params.id;
  await deleteUserFromDB(_id);
  res
    .status(StatusCodes.NO_CONTENT)
    .send({ data: "Account Delete Successfully" });
};

const profilePhotoUpload = async (req, res) => {
  let user = await User.findById(req.user._id);
  const data = await uploadToCloudinary(req.file.path, user._id.toString());
  if (data) {
    user = await User.findByIdAndUpdate(
      { _id: user._id },
      {
        $set: { profilePicture: data.url },
      },
      { new: true }
    );
  }

  res.status(StatusCodes.OK).json({ data: "File uploaded Successfully" });
};

// router.route("/profile-viewers/:id").get
const profileViewers = async (req, res) => {
  // if(req.params.)
  const { id } = req.params;
  let user = await User.findOne({ _id: id }).select("-password");
  if (!user) {
    throw new CustomError.NotFoundError(`No user with id : ${id}`);
  }
  checkPermissions(req.user, user._id);
  user = await User.findByIdAndUpdate(req.user._id, { new: true }).populate({
    path: "viewers",
  });

  res.status(StatusCodes.OK).json({ data: user.viewers });
};

const follow = async (req, res) => {
  const followerId = req.user._id;
  const followId = req.params.id;
  userNotOperatingOnItself(followerId, followId);

  // The user who is following
  const follower = await User.findById(followerId);
  // The user to follow
  const follow = await User.findById(followId);

  if (!follow) {
    throw new CustomError.NotFoundError("User not found");
  }

  const isAlreadyFollowed = follower.following.find(
    (followed) => followed.toString() === followId.toString()
  );
  if (isAlreadyFollowed) {
    throw new CustomError.BadRequestError("You already followed this user");
  }

  // Add new follower to the user Who is being followed "followers" list
  await User.findByIdAndUpdate(
    followId,
    { $addToSet: { followers: followerId } },
    { new: true }
  );

  // Add new following to the user who is following "following" list
  await User.findByIdAndUpdate(
    followerId,
    { $addToSet: { following: followId } },
    { new: true }
  );

  res.status(StatusCodes.OK).json({
    data: "You have successfully followed this user",
  });
};

const unfollow = async (req, res) => {
  const followerId = req.user._id;
  const followId = req.params.id;
  userNotOperatingOnItself(followerId, followId);

  // The user who is following
  const follower = await User.findById(followerId);
  // The user to unfollow
  const follow = await User.findById(followId);

  if (!follow) {
    throw new CustomError.NotFoundError("User not found");
  }

  const isAlreadyFollowed = follower.following.find(
    (followed) => followed.toString() === followId.toString()
  );
  if (!isAlreadyFollowed) {
    throw new CustomError.BadRequestError("You are not following this user");
  }

  // Add new follower to the user Who is being followed "followers" list
  await User.findByIdAndUpdate(
    followId,
    { $pull: { followers: followerId } },
    { new: true }
  );

  // Add new following to the user who is following "following" list
  await User.findByIdAndUpdate(
    followerId,
    { $pull: { following: followId } },
    { new: true }
  );

  res.status(StatusCodes.OK).json({
    data: "You have successfully unfollowed this user",
  });
};

const getAllUsers = async (req, res) => {
  console.log(req.user);
  const users = await User.find({ role: "user" }).select("-password");
  res.status(StatusCodes.OK).json({ data: users });
};

const getSingleUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne({ _id: id }).select("-password");
  if (!user) {
    throw new CustomError.NotFoundError(`No user with id : ${id}`);
  }
  checkPermissions(req.user, user._id);
  res.status(StatusCodes.OK).json({ data: user });
};

const showCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user._id }).select("-password");
  if (!user) {
    throw new CustomError.NotFoundError(`No user with id : ${req.user._id}`);
  }
  res.status(StatusCodes.OK).json({ data: user });
};

const updateUser = async (req, res) => {
  const { email, username, firstname, lastname } = req.body;
  if (!email || !username || !firstname || !lastname) {
    throw new CustomError.BadRequestError("Please provide all values");
  }
  const user = await User.findOneAndUpdate(
    { _id: req.user._id },
    {
      email,
      username,
      firstname,
      lastname,
    },
    { runValidators: true, new: true }
  );
  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError(`
        Old and new passwords are required
        `);
  }
  const user = await User.findOne({ _id: req.user._id });
  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Invalid credentials");
  }
  user.password = newPassword;

  await user.save();
  res.status(StatusCodes.OK).json({ data: "Success! Password updated" });
};

module.exports = {
  createUser,
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
  deleteAccount,
  deleteUser,
  profilePhotoUpload,
  profileViewers,
  follow,
  unfollow,
};
