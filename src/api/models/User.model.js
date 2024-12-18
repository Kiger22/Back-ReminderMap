const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ["admin", "user"],
      default: "user",
    },
    name: { type: String, required: false },
    email: { type: String, required: false },
    avatar: { type: String, required: false },
    myHouseLocation: { type: String, required: false },
    myWorkLocation: { type: String, required: false },
    myFavoritesLocations: [{
      type: mongoose.Types.ObjectId,
      ref: 'favorites',
      required: false
    }],
  },
  {
    timestamps: true,
    collection: "users",
  }
);

userSchema.pre("save", function () {
  this.password = bcrypt.hashSync(this.password, 10);
})

const User = mongoose.model("users", userSchema, "users");
module.exports = User;