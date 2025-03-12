const { isAdmin, isAuth } = require("../../middlewares/auth");
const { upload } = require("../../middlewares/file");
const {
  getUser,
  registerUser,
  loginUser,
  getUserProfile,
  updateUser,
  deleteUser
} = require("../controllers/User.controllers");

const userRoutes = require("express").Router();

// Ruta para obtener todos los usuarios (solo admin)
userRoutes.get("/", [isAdmin], getUser);

// Ruta para registrar un nuevo usuario
userRoutes.post("/register", upload('avatars').single('avatar'), (req, res, next) => {
  console.log(req.file); // Verificamos que el archivo se haya subido correctamente
  next();
}, registerUser);

// Ruta para iniciar sesión
userRoutes.post("/login", loginUser);

// Ruta para obtener el perfil de un usuario
userRoutes.get("/:id/profile", [isAuth], getUserProfile);

// Ruta para actualizar un usuario
userRoutes.put("/:id", [isAuth], updateUser);

// Ruta para eliminar un usuario
userRoutes.delete("/:id", [isAuth], deleteUser);

module.exports = userRoutes;