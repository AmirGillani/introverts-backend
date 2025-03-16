const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: { type: String, required: true ,trim: true},
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    profilePic: { type: String },
    coverPic: {
      type: String,
    },
    about: { type: String },
    livesIn: { type: String },
    worksAt: { type: String },
    relationship: { type: String },
    followers: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
    following: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
