const catchAsyncError = require("../middleware/utilities/catch-async-errors");

const HttpsErrors = require("../middleware/utilities/http-errors");

const { validationResult } = require("express-validator");

const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");

const saltRounds = 10;

const USERMODEL = require("../model/userModel");

module.exports.signup = catchAsyncError(async (req, res, next) => {
  const errors = validationResult(req);

  // Check if validation failed
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Proceed to create the user
  const { username, password, firstName, lastName, isAdmin } = req.body;

  const hashed = await bcrypt.hash(password, saltRounds);

  if (req.file && req.file.path) {
    const user = await USERMODEL.create({
      username,
      password: hashed,
      firstName,
      lastName,
      profilePic: req.file.path,
      isAdmin,
    });

    const token = jwt.sign({ ...user }, process.env.JWT_SECRET,{ expiresIn: "7d" });

    if (user) res.status(201).json({ message: "User created", user, token });
  } else {
    const user = await USERMODEL.create({
      username,
      password: hashed,
      firstName,
      lastName,
      isAdmin,
    });

    const token = jwt.sign({ ...user }, process.env.JWT_SECRET,{ expiresIn: "7d" });

    if (user) res.status(201).json({ message: "User created", user, token });
  }
});

module.exports.login = catchAsyncError(async (req, res, next) => {
  // Proceed to create the user
  const { username, password } = req.body;

  const errors = validationResult(req);

  // Check if validation failed
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const user = await USERMODEL.findOne({ username: username });

  if (!user) return res.status(404).json({ message: "No user found!!!" });

  const valid = await bcrypt.compare(password, user.password);

  if (!valid)
    return res
      .status(400)
      .json({ errors: [{ msg: "Password is incorrect", path: "password" }] });

  const token = jwt.sign({ ...user }, process.env.JWT_SECRET,{ expiresIn: "5s" });

  // Send response with token and user data (excluding password)
  const userWithoutPassword = { ...user.toObject(), password: "" };

  res
    .status(200)
    .json({ message: "Login User", user: userWithoutPassword, token });
});
