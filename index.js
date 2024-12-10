require("dotenv").config();
const cors = require('cors');
const express = require("express");
const { connectDB } = require("./src/config/db");
const mainRoutes = require("./src/api/routes/main.routes");
const app = express();

// Conexión a la base de datos y inicio del servidor
const PORT = process.env.PORT || 3000;
connectDB();

// Configuración CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],


}));

// Middlewares básicos
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  console.log('Origen:', req.headers.origin);
  next();
});

// Rutas
app.use('/api/v1', mainRoutes);

// Ruta de prueba
app.get('/api/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'API is running'
  });
});

app.use("*", (req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

// Manejo de errores
app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ message: "El archivo es demasiado grande. Máximo permitido: 5 MB." });
  }
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Error inesperado',
    status: err.status || 500
  });
});


app.listen(3000, () => {
  console.log(`Server running in http://localhost:${PORT}`);
});

module.exports = app;