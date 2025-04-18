const express = require("express");

const userController = require("../controllers/userController");

const upload = require("../middleware/config/multer");

const check = require("../middleware/config/check-auth");

const router = express.Router();

router.get("/", userController.allUsers);

router.get("/:id", userController.singleUser);

router.delete("/deleteUser/:id",check, userController.singleUserDelete);

router.put("/follow/:id",check, userController.followUser);

router.put("/unfollow/:id",check, userController.unfollowUser);

router.put("/fetchFollowers", userController.fetchFollowers);

router.put(
  "/updateUser/:id",check,
  upload.fields([
    { name: "profilePic", maxCount: 1 }, // for profile picture (one image)
    { name: "coverPic", maxCount: 1 }, // for cover picture (one image)
  ]),
  userController.singleUserUpdate
);

module.exports = router;
