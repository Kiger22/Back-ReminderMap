const User = require("../api/models/User.model");
const { verifyJwt } = require("../config/jwt");

//? Middleware para verificar si el usuario está autenticado y si es administrador

// Middleware para verificar si el usuario está autenticado
const isAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    console.log('Token recibido:', token);


    if (!token) {
      return res.status(401).json({ mensaje: "Token necesario" });
    }

    const { id } = verifyJwt(token);
    const user = await User.findById(id);

    console.log('Usuario encontrado:', user);

    if (!user) {
      return res.status(403).json({ mensaje: "No está autorizado" });
    }

    // Evitamos devolver la contraseña en la respuesta
    user.password = undefined;
    req.user = user;
    console.log({ UserAutenticado: id, Token: token });
    next();
  }
  catch (error) {
    return res.status(401).json({
      mensaje: error.message || "Token inválido o expirado",
      éxito: false
    });
  }
};

// Middleware para verificar si el usuario es administrador
const isAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    console.log('Token recibido:', token);

    if (!token) {
      return res.status(401).json({ mensaje: "Token necesario" });
    }

    const { id } = verifyJwt(token);
    const user = await User.findById(id);
    console.log('Usuario encontrado:', user);

    // Evitamos devolver la contraseña en la respuesta
    if (user && user.role === "admin") {
      user.password = undefined;
      req.user = user;
      next();
    } else {
      return res.status(403).json({
        mensaje: "No está autorizado para realizar esta acción",
        éxito: false
      });
    }
  }
  catch (error) {
    return res.status(401).json({
      mensaje: error.message || "Token inválido o expirado",
      éxito: false
    });
  }
};

module.exports = {
  isAuth,
  isAdmin,
};