const mongoose = require('mongoose');
require("dotenv").config();

//? Conexión a MongoDB

//*Opciones para Mongoose
const mongooseOptions = {
  autoIndex: true,                  // Necesario para índices
  serverSelectionTimeoutMS: 5000,   // Tiempo de espera para selección de servidor
  socketTimeoutMS: 45000,           // Tiempo de espera de socket
  family: 4,                        // Usar IPv4, omitir para auto-detección
};

// Variable para intentos de reconexión
let retryCount = 0;
const MAX_RETRIES = 5;

//* Conexión a MongoDB con manejo de reintentos
const connectDB = async () => {
  try {
    // Verificamos que existe la variable de entorno
    if (!process.env.MONGODB_URI) {
      throw new Error('Variable de entorno MONGODB_URI no definida');
    }
    //Conectamos BBDD
    await mongoose.connect(process.env.MONGODB_URI, mongooseOptions);
    console.log('BBDD Conectada correctamente');
    // Reiniciamos contador de intentos cuando la conexión es exitosa
    retryCount = 0;
  }
  catch (error) {
    console.error('Error al conectar con MongoDB:', error.message);

    // Lógica de reintentos
    if (retryCount < MAX_RETRIES) {
      retryCount++;
      console.log(`Reintentando conexión (${retryCount}/${MAX_RETRIES}) en 5 segundos...`);
      return new Promise((resolve) => {
        setTimeout(() => resolve(connectDB()), 5000);
      });
    } else {
      throw new Error(`No se pudo conectar después de ${MAX_RETRIES} intentos`);
    }
  }
};

module.exports = { connectDB };