const mongoose = require("mongoose");
const { Schema } = mongoose;

const postSchema = new Schema(
  {
    userID: { type:Schema.Types.ObjectId , ref: "User"  },
    desc: { type: String, required: true },
    image: { type: String, required: true },
    likes: { type: String, required: true },
   
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
