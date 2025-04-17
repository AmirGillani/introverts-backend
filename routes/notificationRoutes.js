const express = require("express");

const notificationController = require("../controllers/notificationController");

const router = express.Router();

router.put(
  "/save-fcm-token",
  notificationController.saveFCMToken
);

router.post(
    "/send-notification",
    notificationController.sendNotification
  );



module.exports = router;
