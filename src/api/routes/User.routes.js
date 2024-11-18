
const { isAdmin, isAuth } = require("../../middlewares/auth");
const { upload } = require("../../middlewares/file");
const {
  registerUser,
  loginUser,
  deleteUser,
  updateUserRoles,
  getUser
} = require("../controllers/User.controllers");

const userRoutes = require("express").Router();

userRoutes.get("/", [isAdmin], getUser);
userRoutes.post("/register", upload('Avatars').single('Avatar'), registerUser);
userRoutes.post("/login", loginUser);
userRoutes.put("/:id/role", [isAdmin], updateUserRoles);
userRoutes.delete("/:id", [isAuth], deleteUser);

module.exports = userRoutes;