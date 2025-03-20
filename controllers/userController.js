const catchAsyncError = require("../middleware/utilities/catch-async-errors");

const HttpsErrors = require("../middleware/utilities/http-errors");

const { validationResult } = require("express-validator");

const userModel = require("../model/userModel");

const postModel = require("../model/postModel");

module.exports.singleUser = catchAsyncError(async (req, res, next) => {
  const id = req.params.id;

  const user = await userModel.findById(id).select("-password");

  if (!user) return res.status(404).json({ message: "No user found" });

  res.status(200).json({ user });
});

module.exports.singleUserUpdate = catchAsyncError(async (req, res, next) => {

  const id = req.params.id;

  // Find the user by ID
  const user = await userModel.findById(id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Update images if they are sent 

  const { profilePic, coverPic } = req.files;

  let profilePicPath = profilePic ? profilePic[0].path : null;
  let coverPicPath = coverPic ? coverPic[0].path : null;

  if (profilePicPath) {
    user.profilePic = profilePicPath; 
  }

  if (coverPicPath) {
    user.coverPic = coverPicPath; 
  }

  await user.save();

  // Update other fileds

  await userModel.findByIdAndUpdate(id,req.body)

  res.status(200).json({ user });
});

module.exports.singleUserDelete = catchAsyncError(async (req, res, next) => {
  const id = req.params.id;

  // Find the user that is to be deleted

  const userToDelete = await userModel.findById(id);

  if (!userToDelete) {
    return res.status(404).json({ message: "User not found" });
  }

  const users = await userModel.find({});

  // DELETE USER FROM FOLLOWER AND FOLLOWING ARRAYS

  const userUpdatePromises = users.map(async (user) => {

    if (user.following.includes(id)) {
      await userModel.findByIdAndUpdate(user._id, { $pull: { following: id } });
    }

    if (user.followers.includes(id)) {
      await userModel.findByIdAndUpdate(user._id, { $pull: { followers: id } });
    }
  });

  await Promise.all(userUpdatePromises);

  // DELETE ALL LIKES HE HAS DONE ON POSTS

  const posts = await postModel.find({});

  const postUpdatePromises = posts.map(async (post) => {

    if (posts.likes.includes(id)) {
      await postModel.findByIdAndUpdate(post._id, { $pull: { likes: id } });
    }

  });

  await Promise.all(postUpdatePromises);

  // FINALLY DELETE USER

  await userModel.findByIdAndDelete(id);

  res.status(200).json({ message: "User deleted successfully!!" });
});

module.exports.followUser = catchAsyncError(async (req, res, next) => {
  // Suppose zeeshan follows syeda

  const syedaID = req.params.id;

  const { currentUserID: zeeID } = req.body;

  if (syedaID === zeeID)
    return res.status(200).json({ message: "You can not follow yourself!!" });

  // Find users

  const Syeda = await userModel.findById(syedaID);

  const Zeeshan = await userModel.findById(zeeID);

  // Check if you are already following her

  if (Syeda.followers.includes(zeeID))
    return res
      .status(200)
      .json({ message: "You are already following this id!!" });

  // Push user in follwer and following arrays

  await userModel.findByIdAndUpdate(syedaID, { $push: { followers: zeeID } });

  await userModel.findByIdAndUpdate(zeeID, { $push: { following: syedaID } });

  res.status(200).json({ message: "User followed successfully !!" });
});

module.exports.unfollowUser = catchAsyncError(async (req, res, next) => {
  // Suppose zeeshan unfollows syeda

  const syedaID = req.params.id;

  const { currentUserID: zeeID } = req.body;

  if (syedaID === zeeID)
    return res.status(200).json({ message: "You can not unfollow yourself!!" });

  // Find users

  const Syeda = await userModel.findById(syedaID);

  const Zeeshan = await userModel.findById(zeeID);

  // Check if you are already unfollowing her

  if (Zeeshan.following.length > 0 && !Zeeshan.following.includes(syedaID))
    return res
      .status(200)
      .json({ message: "You are already not following this id!!" });

  // Pull user in follwer and following arrays

  await userModel.findByIdAndUpdate(syedaID, { $pull: { followers: zeeID } });

  await userModel.findByIdAndUpdate(zeeID, { $pull: { following: syedaID } });

  res.status(200).json({ message: "User un followed successfully !!" });
});

