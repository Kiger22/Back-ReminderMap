require("dotenv").config();
const cors = require('cors');
const express = require("express");
const { connectDB } = require("./src/config/db");
const mainRoutes = require("./src/api/routes/main.routes");
const app = express();

// Conexión a la base de datos y inicio del servidor
const PORT = process.env.PORT || 3001;
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Opciones CORS
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:5173'
    : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  credentials: true, // Permite enviar cookies a través de solicitudes CORS
  maxAge: 86400 // Cachea los resultados del preflight por 1 día
};

// Configuración de CORS
app.use(cors(corsOptions));

// Middlewares básicos
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

// Middleware para mostrar en consola las solicitudes que llegan al servidor
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  console.log('Origen:', req.headers.origin);
  next();
});

// Rutas
app.use('/api/v1', mainRoutes);

// Ruta de verificación de salud del servidor
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Middleware para rutas no encontradas
app.use("*", (req, res, next) => {
  const error = new Error("Ruta no encontrada");
  error.status = 404;
  next(error);
});

// Middleware centralizado para manejo de errores
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

startServer();
