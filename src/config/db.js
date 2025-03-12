const mongoose = require('mongoose');
require("dotenv").config();

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
      console.error('Error: Variable de entorno MONGODB_URI no definida');
      process.exit(1);
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
      setTimeout(connectDB, 5000); // Reintentar después de 5 segundos
    } else {
      console.error(`No se pudo conectar después de ${MAX_RETRIES} intentos`);
      if (process.env.NODE_ENV === 'production') {
        // Notificamos al sistema de monitoreo
        console.error('Fallo crítico de conexión a la base de datos');
      } else {
        process.exit(1);
      }
    }
  }
};

//* Manejo de eventos de conexión
mongoose.connection.on('connected', () => {
  console.log('MongoDB conectada en', mongoose.connection.host);
});

mongoose.connection.on('error', err => {
  console.error('Error en la conexión de MongoDB:', err);
  // Solo intentamos reconectar si la conexión ya estaba establecida previamente
  if (mongoose.connection.readyState !== 0) {
    console.log('Intentando reconectar automáticamente...');
  }
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB desconectada');
  // No reconectamos si la desconexión fue intencional (readyState 0)
  if (mongoose.connection.readyState !== 0 && retryCount < MAX_RETRIES) {
    console.log('Reconectando...');
    setTimeout(connectDB, 3000);
  }
});

//* Cerramos conexión
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('Conexión a MongoDB cerrada debido a la terminación de la aplicación');
    process.exit(0);
  } catch (error) {
    console.error('Error al cerrar la conexión de MongoDB:', error);
    process.exit(1);
  }
});

module.exports = { connectDB };