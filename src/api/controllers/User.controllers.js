const bcrypt = require("bcrypt");
const User = require("../models/User.model");
const { generateSign } = require("../../config/jwt");

//Obtener usuarios
const getUser = async (req, res, next) => {
  try {
    const user = await User.find();
    return res.status(200).json(user);
  }
  catch (error) {
    return res.status(400).json({
      message: 'Error obtener usuarios',
      error: error.message
    });
  }
};

//Registro
const registerUser = async (req, res, next) => {
  try {
    const { email, password, name, username } = req.body;

    // Validaciones
    if (!email || !password || !name || !username) {
      return res.status(400).json({
        message: "Todos los campos son obligatorios"
      });
    }

    const existingUser = await User.findOne({
      email: req.body.email
    });

    if (existingUser) {
      return res.status(400).json({ message: "Este usuario ya existe" });
    }

    const avatar = req.file ? req.file.path : null;

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = new User({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      avatar,
      role: "user",
    });

    const userSaved = await newUser.save();
    const userResponse = userSaved.toObject();
    delete userResponse.password;

    return res.status(201).json({
      message: "Usuario registrado",
      user: userResponse
    });
  }
  catch (error) {
    return res.status(400).json({
      message: "Error al registrar usuario: ",
      error: error.message
    });
  }
};

//Login
const loginUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      return res.status(401).json({
        message: "Este usuario no existe"
      });
    }

    const passwordMatch = bcrypt.compareSync(req.body.password, user.password);

    if (passwordMatch) {
      const token = generateSign(user._id);
      return res.status(200).json({
        message: "Acceso permitido",
        user,
        token
      });
    } else {
      return res.status(401).json({
        message: "Contraseña incorrecta"
      });
    }
  }
  catch (error) {
    return res.status(500).json({
      message: "Ocurrió un error inesperado. Inténtalo nuevamente más tarde.",
      error: error.message
    });
  }
};

// Cambiar Roles
const updateUserRoles = async (req, res) => {

  try {
    const { id } = req.params;
    const userToUpdate = await User.findById(id);

    if (!userToUpdate) {
      return res.status(404).json({
        message: "Usuario no encontrado"
      });
    }

    userToUpdate.role = req.body.role;
    await userToUpdate.save();
    return res.status(200).json({
      message: "Rol actualizado correctamente",
      user: userToUpdate
    });
  }
  catch (error) {
    return res.status(500).json({
      message: "Error al actualizar el rol",
      error: error.message
    });
  }
};

// Eliminar un usuario
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role === "admin" || req.user._id.toString() === id) {
      const userToDelete = await User.findByIdAndDelete(id);

      if (!userToDelete) {
        return res.status(404).json({
          message: "Usuario no encontrado"
        });
      };

      return res.status(200).json({
        message: "Usuario eliminado correctamente",
        user: userToDelete
      });
    } else {
      return res.status(403).json({
        message: "No tienes permisos para eliminar este usuario"
      });
    }
  }
  catch (error) {
    return res.status(500).json({
      message: "Error al eliminar el usuario",
      error: error.message
    });
  }
};

module.exports = {
  getUser,
  registerUser,
  loginUser,
  updateUserRoles,
  deleteUser,
}