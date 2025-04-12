const { body } = require("express-validator");

const User = require("../../model/userModel");

module.exports = [
  // Username: Required, should be a string, no spaces allowed
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isString()
    .withMessage("Username must be a string")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),

  // Password: Required, should be a string and at least 6 characters
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isString()
    .withMessage("Password must be a string")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),


];
