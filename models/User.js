const mongoose = require("mongoose")

const UserShchema = new mongoose.Schema({
   fullName: {
      type: String,
      required: true,
   },
   email: {
      type: String,
      required: true,
      unique: true,
   },
   passwordHash: {
      type: String,
      required: true,
   },
   avatarUrl: {
      type: String,
   },
})

const UserModel = mongoose.model("users", UserShchema);

module.exports = UserModel;
