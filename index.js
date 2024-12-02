require("dotenv").config();
const cors = require('cors');
const express = require("express");
const { connectDB } = require("./src/config/db");
const mainRoutes = require("./src/api/routes/main.routes");

const app = express();
app.options('*', cors());

// Configuración de CORS usando el middleware cors
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];

/* app.use(cors({
  origin: function (origin, callback) {
    // Si el origen no está definido (por ejemplo, en herramientas locales como Insomnia/Postman)
    if (!origin) return callback(null, true);

    // Verifica si el origen está en la lista permitida
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Bloquea la solicitud si el origen no es válido
    const msg = 'La política CORS no permite el acceso desde este origen.';
    return callback(new Error(msg), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
})); */

app.use(cors({
  origin: '*',
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

// Manejo de logs de origen y método de la petición
app.use((req, res, next) => {
  console.log('Origen:', req.headers.origin);
  console.log('Método:', req.method);
  next();
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