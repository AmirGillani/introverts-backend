const express = require("express");

const validation = require("../middleware/validations/signupValidation");

const authController = require("../controllers/authController");

const upload = require("../middleware/config/multer")

const router = express.Router();

router.post("/signup",upload.single("profilePic"),validation,authController.signup);

router.post("/login",authController.login);

module.exports = router;