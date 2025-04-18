const catchAsyncError = require("../middleware/utilities/catch-async-errors");

const HttpsErrors = require("../middleware/utilities/http-errors");

const { validationResult } = require("express-validator");

const userModel = require("../model/userModel");

const postModel = require("../model/postModel");

module.exports.allUsers = catchAsyncError(async (req, res, next) => {

  const users = await userModel.find({}).select("-password");

  res.status(200).json({ users });
});

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

  // Check if files are uploaded
  const { profilePic, coverPic } = req.files || {}; // Handle missing files safely

  // Update the profilePic and coverPic only if new files are provided
  if (profilePic) {
    user.profilePic = profilePic[0].path; // Update the profilePic if the new file is uploaded
  }

  if (coverPic) {
    user.coverPic = coverPic[0].path; // Update the coverPic if the new file is uploaded
  }

  // Update other fields from the request body (except images)
  Object.assign(user, req.body);

  // Save the updated user
  await user.save();

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
  const syedaID = req.params.id; // The user being followed
  const currentUserID = req.user._id.toString(); // The current logged-in user (Zeeshan)

  if (syedaID === currentUserID) {
    return res.status(400).json({ message: "You cannot follow yourself!" });
  }

  const Syeda = await userModel.findById(syedaID);
  const Zeeshan = await userModel.findById(currentUserID);

  if (!Syeda || !Zeeshan) {
    return res.status(404).json({ message: "User not found" });
  }

  if (Syeda.followers.includes(currentUserID)) {
    return res
      .status(400)
      .json({ message: "You are already following this user!" });
  }

  // Update followers and following
  await userModel.findByIdAndUpdate(syedaID, {
    $push: { followers: currentUserID },
  });

  await userModel.findByIdAndUpdate(currentUserID, {
    $push: { following: syedaID },
  });

  const user = await userModel.findById(req.user._id);

  res.status(200).json({ message: "User followed successfully!",user:user });
});


module.exports.unfollowUser = catchAsyncError(async (req, res, next) => {
  // Suppose zeeshan unfollows syeda

  const syedaID = req.params.id;

  const zeeID  = req.user._id;

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

  const user = await userModel.findById(req.user._id);

  res.status(200).json({ message: "User un followed successfully !!",user:user });
});

module.exports.fetchFollowers = catchAsyncError(async (req, res, next) => {


  const {text,id}  = req.body;


  if(text === "followers"){
    const { followers } = await userModel
    .findById(id)
    .select('followers')
    .populate('followers', 'firstName lastName username profilePic');

    res.status(200).json({followers});

  }else if(text === "following")
  {
    const { following } = await userModel
    .findById(id)
    .select('following')
    .populate('following', 'firstName lastName username profilePic');

    res.status(200).json({followers:following});
  }

});

