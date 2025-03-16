const express = require("express");

const validation = require("../middleware/validations/signupValidation");

const authController = require("../controllers/authController");

const router = express.Router();

router.post("/signup",validation,authController.signup);

router.post("/login",authController.login);

module.exports = router;