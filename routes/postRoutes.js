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
    "/:id",
    postController.singlePost
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

  router.put(
    "/timeline",
    check,
    postController.timeLine
  );



module.exports = router;
