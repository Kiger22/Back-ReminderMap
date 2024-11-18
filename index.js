require("dotenv").config();
const cors = require('cors');
const express = require("express");
const { connectDB } = require("./src/config/db");
const mainRoutes = require("./src/api/routes/main.routes");

const app = express();

// Configuración de CORS
app.use(cors({
  origin: '*', // O tu URL específica del frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexión a la base de datos
connectDB().catch(console.error);

// Rutas
app.use('/api/v1', mainRoutes);

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'unexpected error',
    status: err.status || 500
  });
});

// Para Vercel, exportamos la app
module.exports = app;