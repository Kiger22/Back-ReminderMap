require("dotenv").config();
const cors = require('cors');
const express = require("express");
const mongoose = require('mongoose');
const { connectDB } = require("./src/config/db");
const { killPort } = require("./src/utils/portManager");
const mainRoutes = require("./src/api/routes/main.routes");
const app = express();

//? Conexión a la base de datos y inicio del servidor
const PORT = process.env.PORT || 3000;
let server = null;

const cleanupServer = async () => {
  try {
    if (server && server.listening) {
      await new Promise((resolve, reject) => {
        server.close((err) => {
          if (err && err.code !== 'ERR_SERVER_NOT_RUNNING') {
            console.error('Error al cerrar el servidor:', err);
            reject(err);
          } else {
            console.log('Servidor cerrado correctamente');
            resolve();
          }
        });
      });
    }

    if (mongoose.connection && mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log('Conexión a MongoDB cerrada correctamente');
    }
  } catch (error) {
    console.error('Error durante la limpieza:', error);
  }
};

const startServer = async () => {
  try {
    // Intentamos liberar puertos antes de iniciar
    await killPort(PORT);
    await killPort(9229); // Puerto del inspector

    console.log('Conectando a la base de datos...');
    await connectDB();
    console.log('Iniciando el servidor...');

    // Iniciamos el servidor
    server = app.listen(PORT);

    server.once('listening', () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });

    server.once('error', async (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Puerto ${PORT} está en uso. Intentando liberar...`);
        await killPort(PORT);
        // Reintentamos iniciar el servidor
        server = app.listen(PORT);
      } else {
        throw err;
      }
    });

  } catch (error) {
    console.error('Error al iniciar el servidor:', error.message);
    await cleanupServer();
    process.exit(1);
  }
};

// Manejadores de eventos para cierre graceful
process.on('SIGTERM', async () => {
  console.log('Señal SIGTERM recibida. Iniciando cierre graceful...');
  await cleanupServer();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('Señal SIGINT recibida. Iniciando cierre graceful...');
  await cleanupServer();
  process.exit(0);
});

process.on('uncaughtException', async (error) => {
  console.error('Error no capturado:', error);
  await cleanupServer();
  process.exit(1);
});

process.on('unhandledRejection', async (reason, promise) => {
  console.error('Promesa rechazada no manejada:', reason);
  await cleanupServer();
  process.exit(1);
});

//? Opciones CORS
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:5173'
    : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  credentials: true,  // Permite enviar cookies a través de solicitudes CORS
  maxAge: 86400       // Cachea los resultados del preflight por 1 día
};

//? Configuración de CORS
app.use(cors(corsOptions));

//? Middlewares básicos
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

//? Middleware para mostrar en consola las solicitudes que llegan al servidor
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  console.log('Origen:', req.headers.origin);
  next();
});

//? Rutas
app.use('/api/v1', mainRoutes);

//? Ruta de verificación de salud del servidor
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

//? Middleware para rutas no encontradas
app.use("*", (req, res, next) => {
  const error = new Error("Ruta no encontrada");
  error.status = 404;
  next(error);
});

//? Middleware centralizado para manejo de errores
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

//? Iniciar el servidor
startServer();
