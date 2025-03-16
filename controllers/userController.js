const catchAsyncError = require("../middleware/utilities/catch-async-errors");

const HttpsErrors = require("../middleware/utilities/http-errors");

const { validationResult } = require("express-validator");
const userModel = require("../model/userModel");

module.exports.singleUser = catchAsyncError(async (req, res, next) => {

  const id = req.params.id;

  const user = await userModel.findById(id).select('-password');

  if(!user) return res.status(404).json({message:"No user found"});

  res.status(200).json({user});
});
