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

userSchema.pre("save", async function (next) {
  try {
    // Solo hash la contraseña si ha sido modificada o es nueva
    if (!this.isModified('password')) {
      return next();
    }

    // Asegurarse de que la contraseña esté limpia antes de hashear
    this.password = this.password.trim();
    console.log("Contraseña antes de Hashear:", this.password);

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log("Contraseña Hasheada:", this.password);
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model("users", userSchema, "users");
module.exports = User;