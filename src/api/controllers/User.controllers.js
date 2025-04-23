const bcrypt = require("bcrypt");
const User = require("../models/User.model");
const { generateSign } = require("../../config/jwt");

//? Obtener usuarios
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

//? Registrar nuevo usuario
const registerUser = async (req, res, next) => {
  try {
    const { name, username, email, password } = req.body;

    // Verificamos si se subió un avatar o usamos uno por defecto
    const avatarUrl = req.file ? req.file.path : 'uploads/avatars/default-avatar.png';

    // Verificamos si el usuario ya existe por nombre de usuario
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Este nombre de usuario ya está registrado"
      });
    }

    // Creamos nuevo usuario
    const newUser = new User({
      name,
      username,
      email,
      password,
      avatar: avatarUrl,
      role: "user",
      createdAt: new Date()
    });

    // Guardamos el usuario en la base de datos
    const savedUser = await newUser.save();

    return res.status(201).json({
      success: true,
      message: "Usuario registrado correctamente",
      user: {
        _id: savedUser._id,
        name: savedUser.name,
        username: savedUser.username,
        email: savedUser.email,
        avatar: savedUser.avatar
      }
    });
  } catch (error) {
    console.error('Error en registerUser:', error);
    return res.status(500).json({
      success: false,
      message: "Error al registrar usuario",
      error: error.message
    });
  }
};

//? Login
const loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    console.log('Datos recibidos:', {
      username,
      passwordLength: password?.length,
      passwordTrimmed: password?.trim()?.length
    });

    // Validación de campos
    if (!username || !password) {
      return res.status(400).json({
        mensaje: "Usuario y contraseña son requeridos",
        éxito: false
      });
    }

    // Buscamos usuario por username
    const user = await User.findOne({ username });
    console.log('Usuario encontrado:', {
      found: !!user,
      hashedPassword: user?.password?.substring(0, 20) + '...' // Solo mostramos parte del hash
    });

    // Si no se encuentra el usuario, devolvemos un error
    if (!user) {
      return res.status(401).json({
        mensaje: "Usuario no encontrado",
        éxito: false
      });
    }

    // Comparamos la contraseña ingresada con la contraseña hasheada en la base de datos
    try {
      console.log('Datos para comparación:', {
        passwordInput: password.trim(),
        hashedPasswordInDB: user.password
      });

      const passwordMatch = await bcrypt.compare(password.trim(), user.password);
      console.log('Resultado de comparación:', passwordMatch);

      // Si la contraseña no coincide, devolvemos un error
      if (!passwordMatch) {
        return res.status(401).json({
          mensaje: "Contraseña incorrecta",
          éxito: false
        });
      }

      // Si la contraseña coincide, generamos un token y devolvemos la respuesta
      const token = generateSign(user._id);
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;

      return res.status(200).json({
        mensaje: "Login correcto",
        token,
        user: userWithoutPassword,
        éxito: true
      });

    } catch (bcryptError) {
      console.error('Error específico de bcrypt:', bcryptError);
      return res.status(500).json({
        mensaje: "Error al verificar contraseña",
        error: bcryptError.message,
        éxito: false
      });
    }

  } catch (error) {
    console.error('Error general en loginUser:', error);
    return res.status(500).json({
      mensaje: "Error al iniciar sesión",
      error: error.message,
      éxito: false
    });
  }
};

//? Obtener perfil de usuario
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

    // Evitamos devolver la contraseña en la respuesta
    return res.status(200).json({
      usuario: user,
      éxito: true
    });
  }
  catch (error) {
    return res.status(500).json({
      mensaje: "Error al obtener perfil de usuario",
      error: error.message,
      éxito: false
    });
  }
};

//? Actualizar usuario
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Si hay un nuevo avatar para subir
    if (req.file) {
      updateData.avatar = req.file.path;
    }

    // Eliminamos campos vacíos
    Object.keys(updateData).forEach(key => {
      if (!updateData[key]) delete updateData[key];
    });

    // Actualizamos el usuario
    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    // Si no se encuentra el usuario, devolvemos un error
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }

    // Devolvemos el usuario actualizado
    // Evitamos devolver la contraseña en la respuesta
    return res.status(200).json({
      success: true,
      message: "Usuario actualizado correctamente",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        myHouseLocation: updatedUser.myHouseLocation,
        myWorkLocation: updatedUser.myWorkLocation
      }
    });
  }
  catch (error) {
    next(error);
  }
};

//? Eliminar usuario
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

    // Si no se encuentra el usuario, devolvemos un error
    if (!deletedUser) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado",
        éxito: false
      });
    }

    // Devolvemos la respuesta con éxito
    return res.status(200).json({
      mensaje: "Usuario eliminado correctamente",
      éxito: true
    });
  }
  catch (error) {
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
