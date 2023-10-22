const express = require('express');
const { authorizePermissions, authenticateUser } = require('../middleware/authenticate');
const {
  createCategory,
  allCategories,
} = require("../controllers/categoryController");

const router = express.Router();

router.route("/").get(allCategories);
router.route("/").post(authenticateUser, authorizePermissions("admin"), createCategory)



module.exports = router