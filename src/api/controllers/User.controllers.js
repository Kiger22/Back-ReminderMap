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

//Register
const registerUser = async (req, res, next) => {
  try {
    const { email, password, name, username } = req.body;

    // Validaciones
    if (!email || !password || !name || !username) {
      return res.status(400).json({
        message: "Todos los campos son obligatorios"
      });
    }

    // Validar si el email ya está en uso
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Este usuario ya existe" });
    }

    // Validar si el username ya está en uso
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Este username ya existe" });
    }

    // Subir el avatar (si hay) y obtener la ruta del avatar
    const avatar = req.file ? req.file.path : null;

    // Asegúrate de eliminar espacios en blanco de la contraseña
    const trimmedPassword = password.trim();

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(trimmedPassword, 10);
    console.log('Hash generado:', hashedPassword);

    // Crear el nuevo usuario
    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
      avatar,
      role: "user",
    });

    // Guardar el usuario en la base de datos
    const userSaved = await newUser.save();
    console.log('Usuario guardado:', userSaved);

    // Convertir a objeto plano y eliminar la contraseña del objeto de respuesta
    const userResponse = userSaved.toObject();
    delete userResponse.password;

    // Devolver el usuario registrado
    return res.status(201).json({
      message: "Usuario registrado con éxito",
      user: userResponse
    });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    return res.status(500).json({
      message: "Error al registrar usuario",
      error: error.message
    });
  }
};

//Login
const loginUser = async (req, res, next) => {

  try {
    // Validar si se enviaron los username y password
    if (!req.body.username || !req.body.password) {
      return res.status(400).json({
        message: "Debes enviar el username y la contraseña"
      });
    }
    const user = await User.findOne({ username: req.body.username });

    // Validar si el usuario existe
    if (!user) {
      return res.status(401).json({
        message: "Este usuario no existe"
      });
    }

    // Validar si la contraseña es correcta
    console.log('Contraseña ingresada:', req.body.password);
    console.log('Hash almacenado:', user.password);
    const passwordMatch = bcrypt.compare(req.body.password.trim(), user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Contraseña incorrecta"
      });
    }

    const token = generateSign(user._id);
    return res.status(200).json({
      message: "Acceso permitido",
      user,
      token
    })
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
    // Validar si el usuario actual es admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "No tienes permisos para cambiar el rol de otros usuarios"
      });
    }
    // Validar si se envió el id del usuario
    if (!req.params.id) {
      return res.status(400).json({
        message: "Debes enviar el id del usuario"
      });
    }
    // Validar si se envió el nuevo rol
    if (!req.body.role) {
      return res.status(400).json({
        message: "Debes enviar el nuevo rol"
      });
    }

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