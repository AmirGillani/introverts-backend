const express = require("express");

const validation = require("../middleware/validations/signupValidation");

const validation2 = require("../middleware/validations/loginValidations");

const authController = require("../controllers/authController");

const upload = require("../middleware/config/multer")

const router = express.Router();

router.post("/signup",upload.single("profilePic"),validation,authController.signup);

router.post("/login",validation2,authController.login);

module.exports = router;