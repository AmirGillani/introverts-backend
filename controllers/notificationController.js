const catchAsyncError = require("../middleware/utilities/catch-async-errors");

const USERMODEL = require("../model/userModel");

const admin = require('firebase-admin');

module.exports.saveFCMToken = catchAsyncError(async (req, res, next) => {

  const { token,userID } = req.body;

  if (token) {

    await USERMODEL.findByIdAndUpdate(
        userID,
        { $set: { fcmToken: token } },
        { new: true } // returns the updated document
      );


    res.status(200).send("Token saved successfully");
  } else {
    res.status(400).send("Token is required");
  }
});

module.exports.sendNotification = catchAsyncError(async (req, res, next) => {
    const message = {
      notification: {
        title: "TITLE",  // Correct notification format
        body: "HI",
      },
      token: 
        "f4LoZpNilzboPqaykNW3gF:APA91bHWenlEiH7iZ7aSl7afzqaO6BrnQ7MNPnM_N8hL7icv8V2OGP57DSq41BN8Wny8dGOzfurlMkfFFidrWw-cJHYlqOZKADwM8PEINPeAztfGiZ5bKO0"
      
    };
  
    try {
      // Send the message to multiple tokens using sendToDevice
    //   const response = await admin.messaging().send(message);
      
      res.status(200).send(`Successfully sent message`);
    } catch (error) {
      // Log the error and send a failure response
      console.error("Error sending notification:", error);
      res.status(500).send("Error sending notification");
    }
  });
  