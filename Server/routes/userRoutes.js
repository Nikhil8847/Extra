const express = require("express");
const router = express.Router();
const {authenticateUser, authorizePermissions} = require("../middleware/authenticate");

const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
  createUser,
  deleteAccount,
  deleteUser,
  profilePhotoUpload,
  profileViewers,
  follow,
  unfollow,
  like
} = require("../controllers/userController");

const upload = require('../middleware/upload')

router.route("/").post(authenticateUser, authorizePermissions("admin"), createUser)

router.route("/").get(authenticateUser, authorizePermissions("admin"), getAllUsers);

router.route("/updateUser").patch(authenticateUser,updateUser);

router.route("/updateUserPassword").patch(authenticateUser,updateUserPassword);

router.route("/delete-account").delete(authenticateUser, deleteAccount)

router.route("/profile-photo-upload").post(authenticateUser, upload.single("profilePicture"),profilePhotoUpload)

router.route("/profile-viewers/:id").get(authenticateUser, profileViewers)

router.route("/follow/:id").get(authenticateUser, follow)

router.route("unfollow/:id").get(authenticateUser, unfollow)

router.route("/showMe").get(authenticateUser,showCurrentUser);

router.route("/:id").delete(authenticateUser, authorizePermissions("admin"), deleteUser)

router.route("/:id").get(authenticateUser, getSingleUser);

module.exports = router;
