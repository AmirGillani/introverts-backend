const mongoose = require("mongoose");
const { Schema } = mongoose;

const replySchema = new Schema({
  img: { type: String, trim: true },
  name: { type: String, trim: true, required: true },
  text: { type: String, trim: true, required: true }
}, { timestamps: true });

const commentSchema = new Schema({
  imgUrl: { type: String, trim: true },
  name: { type: String, trim: true, required: true },
  comment: { type: String, trim: true, required: true },
  reply: { type: [replySchema], default: [] }
}, { timestamps: true });

const postSchema = new Schema(
  {
    userID: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    desc: { type: String, trim: true },
    image: { type: String, required: true, trim: true },
    likes: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
    comments: { type: [commentSchema], default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
