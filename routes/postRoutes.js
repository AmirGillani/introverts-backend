const express = require("express");

const postController = require("../controllers/postController");

const upload = require("../middleware/config/multer");

const check = require("../middleware/config/check-auth");

const router = express.Router();

router.post(
  "/createPost",
  check,
  upload.single("image"),
  postController.createPost
);

router.get(
    "/singlePost/:id",
    postController.singlePost
  );

  router.get(
    "/userPosts/:id",
    postController.singleUserPosts
  );


  router.put(
    "/:id",
    check,
    upload.single("image"),
    postController.updatePost
  );

  router.delete(
    "/:id",
    check,
    postController.deletePost
  );

  router.put(
    "/likePost/:id",
    check,
    postController.likePost
  );

  router.get(
    "/timeline",
    check,
    postController.timeline
  );

  router.put(
    "/sendComment/:id",
    check,
    postController.createComment
  );

  router.put(
    "/editComment/:id",
    check,
    postController.editComment
  );

  router.get(
    "/allComments/:id",
    check,
    postController.allComments
  );

  router.put(
    "/sendReply/:id",
    check,
    postController.createReply
  );



module.exports = router;
