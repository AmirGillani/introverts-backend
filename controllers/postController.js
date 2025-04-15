const catchAsyncError = require("../middleware/utilities/catch-async-errors");

const HttpsErrors = require("../middleware/utilities/http-errors");

const { validationResult } = require("express-validator");

const { sendNotification } = require("../middleware/config/socket-io");

const POSTMODEL = require("../model/postModel");

const USERMODEL = require("../model/userModel");

const mongoose = require("mongoose");

module.exports.createPost = catchAsyncError(async (req, res, next) => {
  const { userID, desc, name, type } = req.body;

  if (req.file && req.file.path) {
    const post = await POSTMODEL.create({
      userID,
      desc,
      image: req.file.path,
      name,
      type,
    });

    if (post) return res.status(201).json({ message: "Post created", post });
  } else {
    if (desc.trim() !== "") {
      const post = await POSTMODEL.create({
        userID,
        desc,
        name,
        type,
      });

      res.status(201).json({ message: "Post created", post });
    } else {
      res.status(500).json({ message: "Write something !!", post });
    }
  }
});

module.exports.singlePost = catchAsyncError(async (req, res, next) => {
  const id = req.params.id;

  const post = await POSTMODEL.findById(id);

  if (!post) return res.status(404).json({ message: "Post not found" });

  res.status(200).json({ post: post });
});

module.exports.singleUserPosts = catchAsyncError(async (req, res, next) => {

  const id = req.params.id;

  const person = await USERMODEL.findById(id);

  if (!person) return res.status(404).json({ message: "Person not found" });

  const userPosts = await POSTMODEL.find({userID:id});

  res.status(200).json({ userPosts: userPosts,person:person });
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

  sendNotification(userID,"Hey how are you !!")

  const posts = await POSTMODEL.find({ userID: userID });

  const followingPosts = await USERMODEL.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(userID) },
    },
    {
      $lookup: {
        from: "posts", // must match the actual collection name
        localField: "following",
        foreignField: "userID",
        as: "followingPosts",
      },
    },
    {
      $project: {
        followingPosts: 1,
        _id: 0,
      },
    },
  ]);

  const followingPostsArray = followingPosts[0]?.followingPosts || [];

  const allPosts = [...posts, ...followingPostsArray].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return res.status(200).json(allPosts);
});

module.exports.createComment = catchAsyncError(async (req, res, next) => {
  const postId = req.params.id;

  const user = req.user;

  const { comment,userID } = req.body;

  if (!comment || comment.trim() === "") {
    return res.status(400).json({ message: "Comment cannot be empty." });
  }

  await POSTMODEL.findOneAndUpdate(
    { _id: postId },
    {
      $push: {
        comments: {
          imgUrl: user.profilePic,
          name: `${user.firstName} ${user.lastName}`,
          comment: comment,
          userID:userID
        },
      },
    },
    { new: true }
  );

  const updatedPost = await POSTMODEL.findById(postId);

  res.status(201).json({ message: "Comment is posted !!", post: updatedPost });
});

module.exports.editComment = catchAsyncError(async (req, res, next) => {
  const postId = req.params.id;
  const { comment, commentID,userID } = req.body;

  if (!comment || comment.trim() === "") {
    return res.status(400).json({ message: "Comment cannot be empty." });
  }

  const post = await POSTMODEL.findById(postId);

  if (!post) {
    return res.status(404).json({ message: "Post not found." });
  }

  const foundComment = post.comments.find(comment=>comment._id.toString() === commentID); 

  if (!foundComment) {
    return res.status(404).json({ message: "Comment not found." });
  }

  foundComment.comment = comment;

  await post.save();

  res.status(200).json({ message: "Comment has been edited!" });
});

module.exports.editReply = catchAsyncError(async (req, res, next) => {
  const postId = req.params.id;
  const { reply, commentID, userID, replyID } = req.body;

  if (!reply || reply.trim() === "") {
    return res.status(400).json({ message: "Reply cannot be empty." });
  }

  const post = await POSTMODEL.findById(postId);

  if (!post) {
    return res.status(404).json({ message: "Post not found." });
  }

  const foundComment = post.comments.find(
    (comment) => comment._id.toString() === commentID
  );

  

  if (!foundComment) {
    return res.status(404).json({ message: "Comment not found." });
  }

  let foundReply = foundComment.reply.find(
    (r) => r._id.toString() === replyID
  );

  if (!foundReply) {
    return res.status(404).json({ message: "Reply not found." });
  }

  // Update the reply
  foundReply.text = reply;
  foundReply.userID = userID; // Optional — only if needed

  await post.save();

  res.status(200).json({ message: "Reply has been edited!" });
});


module.exports.deleteComment = catchAsyncError(async (req, res, next) => {
  const { postID, commentID } = req.params;

  const post = await POSTMODEL.findById(postID);

  if (!post) {
    return res.status(404).json({ message: "Post not found." });
  }

  const originalLength = post.comments.length;

  // Filter out the comment
  post.comments = post.comments.filter(
    (comment) => comment._id.toString() !== commentID
  );

  if (post.comments.length === originalLength) {
    return res.status(404).json({ message: "Comment not found." });
  }

  await post.save();

  res.status(200).json({ message: "Comment has been deleted!" });
});

module.exports.deleteReply = catchAsyncError(async (req, res, next) => {
  const { postID, commentID,replyID } = req.params;

  const post = await POSTMODEL.findById(postID);

  if (!post) {
    return res.status(404).json({ message: "Post not found." });
  }

  // Filter out the comment
  const comment = post.comments.find(
    (comment) => comment._id.toString() === commentID
  );

  comment.reply = comment.reply.filter(
    (reply) => reply._id.toString() !== replyID
  );

  await post.save();

  res.status(200).json({ message: "Comment has been deleted!" });
});


module.exports.allComments = catchAsyncError(async (req, res, next) => {
  const postId = req.params.id;

  const post = await POSTMODEL.findOne({ _id: postId });

  // Sort comments by creation time (ascending)

  const sortedComments = post.comments.sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  res.status(200).json({ comments: sortedComments });
});

module.exports.createReply = catchAsyncError(async (req, res, next) => {
  const postId = req.params.id;

  const user = req.user;

  const { text, commentID } = req.body;

  if (!text || text.trim() === "") {
    return res.status(400).json({ message: "Reply cannot be empty." });
  }

  const post = await POSTMODEL.findOne({ _id: postId });

  const comment = post.comments.find(
    (comment) => comment._id.toString() === commentID
  );

  comment.reply.push({
    img: user.profilePic,
    name: `${user.firstName} ${user.lastName}`,
    text: text,
    userID:user._id
  });

  await post.save();

  res.status(201).json({ message: "Reply is posted !!" });
});
