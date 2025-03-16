const express = require("express");

const userController = require("../controllers/userController");

const router = express.Router();

router.get("/:id",userController.singleUser);

module.exports = router;