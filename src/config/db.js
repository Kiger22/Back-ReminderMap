const mongoose = require('mongoose');
require("dotenv").config();

// Conexión a MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('BBDD Conectada...');
  } catch (error) {
    console.error('Error al conectar con MongoDB:', error);
    process.exit(1);
  }
};

// Eventos de conexión y desconexión
mongoose.connection.on('connected', () => {
  console.log('MongoDB conectada en', mongoose.connection.host);
});
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB desconectada. vuelve a intentarlo...');
});

module.exports = { connectDB };