const catchAsyncError = require("../middleware/utilities/catch-async-errors");

const HttpsErrors = require("../middleware/utilities/http-errors");

const { validationResult } = require("express-validator");

const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');

const saltRounds = 10;

const USERMODEL = require("../model/userModel");

module.exports.signup = catchAsyncError(async (req, res, next) => {
  
  const errors = validationResult(req);

  // Check if validation failed
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Proceed to create the user
  const { username, password, firstName, lastName } = req.body;

  const hashed = await bcrypt.hash(password, saltRounds);

  const token = jwt.sign({
    username, id:user._id
  }, process.env.JWT_SECRET, {
    expiresIn: '1h'
  });

  const user = await USERMODEL.create({ username, password:hashed, firstName, lastName });

  res.status(201).json({message:"User created", user,token });
});

module.exports.login = catchAsyncError(async (req, res, next) => {

  // Proceed to create the user
  const { username, password} = req.body;

  const user = await USERMODEL.findOne({username:username});

  if(!user) return res.status(404).json({message:"No user found!!!"})

  const valid = await bcrypt.compare(password, user.password);

  const token = jwt.sign({
    username, id:user._id
  }, process.env.JWT_SECRET, {
    expiresIn: '1h'
  });

  // Send response with token and user data (excluding password)
  const userWithoutPassword = { ...user.toObject(), password: "" };

  valid ? res.status(200).json({message:"Login User", user:userWithoutPassword ,token }) : res.status(401).json({message:"Password is incorrect"});
  
});
