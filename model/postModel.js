const mongoose = require("mongoose");
const { Schema } = mongoose;

const postSchema = new Schema(
  {
    userID: { type:Schema.Types.ObjectId , ref: "User"  },
    name: { type: String  },
    desc: { type: String  },
    image: { type: String, required: true },
    likes: { type: [{type:Schema.Types.ObjectId , ref: "User"}], default:[] },
   
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
