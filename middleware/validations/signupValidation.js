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
    .withMessage("Username must be at least 3 characters long")
    .custom(async (value) => {
      const user = await User.findOne({ username: value });
      if (user) {
        throw new Error("Username already exists");
      }
      return true;
    }),

  // Password: Required, should be a string and at least 6 characters
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isString()
    .withMessage("Password must be a string")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  // First Name: Required, should be a string
  body("firstName")
    .notEmpty()
    .withMessage("First name is required")
    .isString()
    .withMessage("First name must be a string")
    .trim(),

  // Last Name: Required, should be a string
  body("lastName")
    .notEmpty()
    .withMessage("Last name is required")
    .isString()
    .withMessage("Last name must be a string")
    .trim(),
];
