const express = require('express')
const {liked, createPost,getPost, getAllPosts, unliked, updatePost, deletePost} = require('../controllers/postController');
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authenticate");

const router = express.Router();

router.route("/").get(getAllPosts)

router.route("/").post(authenticateUser, authorizePermissions("admin", "user"), createPost)

router.route("/:id").get(getPost)

router.route("/:id").patch(authenticateUser, updatePost)

router.route("/:id").delete(authenticateUser, deletePost)

router.route("/liked/:id").post(authenticateUser, liked)

router.route("/unliked/:id").post(authenticateUser, unliked)

module.exports = router