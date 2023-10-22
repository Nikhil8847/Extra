const express = require("express");
const { authenticateUser } = require("../middleware/authenticate");

const router = express.Router();



router.route("/").post(authenticateUser, )