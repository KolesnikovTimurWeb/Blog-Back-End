const mongoose = require("mongoose")

const PostSchema = new mongoose.Schema(
   {
      title: {
         type: String,
         required: true,
      },
      text: {
         type: String,
         required: true,
         unique: true,
      },
      tags: {
         type: Array,
         default: [],
      },
      viewsCount: {
         type: Number,
         default: 0,
      },
      user: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'users',
         required: true,
      },
      imageUrl: String,
   },
   {
      timestamps: true,
   },
);

const UserModel = mongoose.model("posts", PostSchema);

module.exports = UserModel;
