const jwt = require("jsonwebtoken");

//? Generamos firma JWT para el usuario autenticado con el ID del usuario y la duración del token (1 año)
const generateSign = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1y" });
};

//? Verificamos la firma JWT y devolver el ID del usuario si es válido
const verifyJwt = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  }
  catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error("El token ha expirado");
    } else {
      throw new Error("Token inválido");
    }
  }
};

module.exports = { generateSign, verifyJwt };
