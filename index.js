require("dotenv").config();
const cors = require('cors');
const express = require("express");
const { connectDB } = require("./src/config/db");
const mainRoutes = require("./src/api/routes/main.routes");

const app = express();

// Lista de orígenes permitidos
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
];

// Configuración de CORS usando el middleware cors
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = "La política CORS para este sitio no permite el acceso desde el Origen especificado.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));

// Manejo de errores de subida de archivos
app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ message: "El archivo es demasiado grande. Máximo permitido: 5 MB." });
  }
  next(err);
});

// Configuración de Cloudinary
app.post('/users/register', upload('avatars').single('avatar'), (req, res, next) => {
  if (req.file) {
    console.log('Archivo subido a Cloudinary:', req.file);
  } else {
    console.log('No se subió ningún archivo');
  }
  next();
});

// Middlewares básicos
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

// Rutas
app.use('/api/v1', mainRoutes);

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'API is running'
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'unexpected error',
    status: err.status || 500
  });
});

// Conexión a la base de datos y inicio del servidor
const PORT = process.env.PORT || 8080;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Puerto del Servidor: http://localhost:${PORT}`);
      console.log('Conectado a MongoDB');
    });
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
  }
};
startServer();

module.exports = app;