const catchAsyncError = require("../middleware/utilities/catch-async-errors");

const HttpsErrors = require("../middleware/utilities/http-errors");

const { validationResult } = require("express-validator");

const POSTMODEL = require("../model/postModel");

const USERMODEL = require("../model/userModel");

module.exports.createPost = catchAsyncError(async (req, res, next) => {
  const { userID, likes, desc } = req.body;

  if (req.file && req.file.path) {
    const post = await POSTMODEL.create({
      userID,
      likes,
      desc,
      image: req.file.path,
    });

    if (post) return res.status(201).json({ message: "Post created", post });
  }

  res.status(500).json({ message: "Post should have an image" });
});

module.exports.singlePost = catchAsyncError(async (req, res, next) => {
  const id = req.params.id;

  const post = await POSTMODEL.findById(id);

  if (!post) return res.status(404).json({ message: "Post not found" });

  res.status(200).json({ post: post });
});

module.exports.updatePost = catchAsyncError(async (req, res, next) => {
  const id = req.params.id;

  const { userID, likes, desc } = req.body;

  // CHECK IF USER IS AUTHENTICATED OR NOT IF YES THEN IT CHECKS EITHER IT IS ADMIN OR IT IS ITS OWN POST

  if (!req.user || (req.user._id !== userID && !req.user.isAdmin)) {
    return res.status(403).json({ message: "It's not your post" });
  }

  if (req.file && req.file.path) {
    const post = await POSTMODEL.findByIdAndUpdate(
      id,
      {
        $set: {
          likes,
          desc,
          image: req.file.path,
        },
      },
      { new: true }
    );

    if (post)
      res.status(200).json({ message: "Post updated successfully !!", post });
  } else {
    const post = await POSTMODEL.findByIdAndUpdate(
      id,
      {
        $set: {
          likes,
          desc,
        },
      },
      { new: true }
    );

    if (post)
      res.status(200).json({ message: "Post updated successfully !!", post });
  }
});

module.exports.deletePost = catchAsyncError(async (req, res, next) => {
  const id = req.params.id;

  const { userID } = req.body;

  // CHECK IF USER IS AUTHENTICATED OR NOT IF YES THEN IT CHECKS EITHER IT IS ADMIN OR IT IS ITS OWN POST

  if (!req.user || (req.user._id !== userID && !req.user.isAdmin)) {
    return res.status(403).json({ message: "It's not your post" });
  }

  await POSTMODEL.findByIdAndDelete(id);

  res.status(200).json({ message: "Post deleted successfully" });
});

module.exports.likePost = catchAsyncError(async (req, res, next) => {
  const id = req.params.id;

  const userID = req.user._id;

  const post = await POSTMODEL.findById(id);

  if (!post.likes.includes(userID)) {
    await POSTMODEL.updateOne({ _id: id }, { $push: { likes: userID } });

    return res.status(200).json({ message: "Post liked successfully!!" });
  } else {
    await POSTMODEL.updateOne({ _id: id }, { $pull: { likes: userID } });

    return res.status(200).json({ message: "Post unliked successfully!!" });
  }
});

module.exports.timeline = catchAsyncError(async (req, res, next) => {
  const userID = req.user._id;

  const posts = await POSTMODEL.find({ userID: userID });

  const followingPosts = await USERMODEL.aggregate([
    // STEP#1 FIND ONE USER
    {
      $match: { _id: userID },
    },
    // STEP#2 FIND POSTS OF USERS WHOM WE ARE FOLLOWING

    // lookup will see two columns following and userID and see same values
    {
      $lookup: {
        from: "Post",
        localField: "following",
        foreignField: "userID",
        as: "followingPosts",
      },
    },

    // STEP#3 This step modifies the output of the aggregation to include only the 

    // followingPosts field and exclude the default _id field.
    
    {
      $project: {
        followingPosts: 1,
        _id: 0,
      },
    },
  ]);

  res
    .status(200)
    .json(
      posts
        .concat(...followingPosts[0].followingPosts)
        .sort((a, b) => b.createdAt - a.createdAt)
    );
});
