const bcrypt = require("bcrypt");
const User = require("../models/User.model");
const { generateSign } = require("../../config/jwt");

//!Obtener usuarios
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

//!Registrar nuevo usuario
const registerUser = async (req, res, next) => {
  try {
    const { name, username, email, password } = req.body;

    // Verificamos si se subió un avatar
    const avatarUrl = req.file ? req.file.path : 'default-avatar-url';

    // Verificamos si el usuario ya existe por nombre de usuario
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        mensaje: "Este nombre de usuario ya está registrado",
        éxito: false
      });
    }

    // Creamos nuevo usuario con contraseña encriptada
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password.trim(), saltRounds);
    console.log("Contraseña hasheada antes de guardar:", hashedPassword);

    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
      avatar: avatarUrl, // Aseguramos que se guarde la URL del avatar
      role: "user", // Asignamos rol predeterminado
      createdAt: new Date()
    });

    // Guardamos el usuario en la base de datos
    const savedUser = await newUser.save();

    // Aseguramos que la respuesta incluya la URL del avatar
    return res.status(201).json({
      éxito: true,
      mensaje: "Usuario registrado correctamente",
      user: {
        _id: savedUser._id,
        name: savedUser.name,
        username: savedUser.username,
        email: savedUser.email,
        avatar: savedUser.avatar
      }
    });
  } catch (error) {
    next(error);
  }
};

//!Login
const loginUser = async (req, res, next) => {
  try {
    // Buscamos usuario por nombre de usuario
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(401).json({
        mensaje: "Usuario no encontrado",
        éxito: false
      });
    }

    // Verificamos contraseña
    const passwordMatch = bcrypt.compare(req.body.password.trim(), user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        mensaje: "Contraseña incorrecta",
        éxito: false
      });
    }

    // Generamos token de autenticación
    const token = generateSign(user._id);

    // Evitamos devolver la contraseña en la respuesta
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    return res.status(200).json({
      mensaje: "Login correcto",
      token: token,
      user: userWithoutPassword,
      éxito: true
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al iniciar sesión",
      error: error.message,
      éxito: false
    });
  }
};

//!Obtener perfil de usuario
const getUserProfile = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // Buscamos usuario por ID
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado",
        éxito: false
      });
    }

    return res.status(200).json({
      usuario: user,
      éxito: true
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al obtener perfil de usuario",
      error: error.message,
      éxito: false
    });
  }
};

//!Actualizar usuario
const updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // Verificamos si el usuario tiene permisos
    if (req.user._id.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        mensaje: "No tienes permiso para actualizar este usuario",
        éxito: false
      });
    }

    // Encriptar, si se intenta actualizar la contraseña
    if (req.body.password) {
      const saltRounds = 10;
      req.body.password = await bcrypt.hash(req.body.password.trim(), saltRounds);
    }

    // Actualizamos datos del usuario
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { ...req.body },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado",
        éxito: false
      });
    }

    return res.status(200).json({
      mensaje: "Usuario actualizado correctamente",
      usuario: updatedUser,
      éxito: true
    });
  }
  catch (error) {
    return res.status(500).json({
      mensaje: "Error al actualizar usuario",
      error: error.message,
      éxito: false
    });
  }
};

//!Eliminar usuario
const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // Verificamos si el usuario tiene permisos
    if (req.user._id.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        mensaje: "No tienes permiso para eliminar este usuario",
        éxito: false
      });
    }

    // Eliminamos usuario
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado",
        éxito: false
      });
    }

    return res.status(200).json({
      mensaje: "Usuario eliminado correctamente",
      éxito: true
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al eliminar usuario",
      error: error.message,
      éxito: false
    });
  }
};

module.exports = {
  getUser,
  registerUser,
  loginUser,
  getUserProfile,
  updateUser,
  deleteUser,
}
