# Backend - ReminderMap

Este es el backend de la aplicación **ReminderMap**, una aplicación de recordatorios basada en ubicación que permite a los usuarios recibir notificaciones y recordatorios cuando están en una ubicación específica o cerca de lugares de interés.

## Tabla de Contenidos

- [Descripción](#descripción)
- [Características](#características)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Configuración y Desarrollo](#configuración-y-desarrollo)
- [API Endpoints](#api-endpoints)
  - [Usuarios](#usuarios)
  - [Recordatorios](#recordatorios)
  - [Lugares](#lugares)
- [Guía de Implementación](#guía-de-implementación)
  - [Manejo de Archivos con Cloudinary](#manejo-de-archivos-con-cloudinary)
  - [Autenticación JWT](#autenticación-jwt)
- [Seguridad](#seguridad)
- [Manejo de Errores](#manejo-de-errores)
- [Contribución](#contribución)
- [Licencia](#licencia)

---

## Descripción

El backend de **ReminderMap** proporciona una API RESTful desarrollada con Node.js, Express, y MongoDB. Permite a los usuarios crear y gestionar recordatorios basados en ubicación, almacenar lugares favoritos, y recibir notificaciones cuando están en lugares específicos.

## Características

- **Autenticación de Usuarios**: Registro e inicio de sesión de usuarios
- **Gestión de Recordatorios**: CRUD para recordatorios que se activan en ubicaciones específicas
- **Lugares y Favoritos**: Posibilidad de añadir lugares de interés y marcarlos como favoritos
- **Notificaciones**: Notificaciones automáticas basadas en la ubicación del usuario
- **Gestión de Archivos**: Integración con Cloudinary para almacenamiento de imágenes
- **Perfiles de Usuario**: Gestión completa de perfiles con avatares y ubicaciones personalizadas

## Tecnologías Utilizadas

- **Node.js** y **Express** para el servidor y API
- **MongoDB** con Mongoose para la base de datos
- **Cloudinary** para el almacenamiento de imágenes
- **JWT** para la autenticación de usuarios
- **Multer** para el manejo de archivos
- **Bcrypt** para el hash de contraseñas

## Estructura del Proyecto

```bash
src/
├── api/
│   ├── controllers/     # Controladores de cada recurso
│   │   ├── User.controllers.js
│   │   └── ...
│   ├── models/         # Esquemas de Mongoose
│   │   ├── User.model.js
│   │   └── ...
│   └── routes/         # Definición de rutas
│       ├── User.routes.js
│       └── ...
├── config/             # Configuraciones
│   ├── db.js          # Configuración MongoDB
│   ├── cldry.js       # Configuración Cloudinary
│   └── jwt.js         # Configuración JWT
├── utils/             # Utilidades
│   └── portManager.js # Gestión de puertos
├── middlewares/        # Middlewares
│   ├── auth.js        # Autenticación
│   └── file.js        # Manejo de archivos
└── index.js           # Entrada principal
```

## Configuración y Desarrollo

### Variables de Entorno

Crear archivo `.env`:

```plaintext
PORT=3000
MONGODB_URI=tu_uri_mongodb
JWT_SECRET=tu_secreto_jwt
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
FRONTEND_URL=http://localhost:5173
```

### Instalación

```bash
# Instalar dependencias
npm install

# Iniciar en desarrollo
npm run dev

# Iniciar en producción
npm start
```

### Scripts Disponibles

- `npm run dev`: Inicia el servidor en modo desarrollo con hot-reload y debugger
- `npm start`: Inicia el servidor en modo producción
- `npm run predev`: Limpia los puertos en uso antes de iniciar el desarrollo

### Gestión de Puertos

El sistema incluye un gestor de puertos automático que:

- Limpia los puertos necesarios antes de iniciar el servidor
- Maneja los puertos 3000 (aplicación) y 9229/9230 (debugger)
- Proporciona recuperación automática si los puertos están en uso

## API Endpoints

### Usuarios

#### Registro de Usuario

- **Ruta**: `POST /api/v1/users/register`
- **Body**: FormData

  ```json
  {
    "username": "string",
    "password": "string",
    "email": "string",
    "avatar": "file"
  }
  ```

#### Login

- **Ruta**: `POST /api/v1/users/login`
- **Body**:

  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```

#### Actualizar Usuario

- **Ruta**: `PUT /api/v1/users/:id`
- **Auth**: Bearer Token
- **Body**: FormData

  ```json
  {
    "name": "string (opcional)",
    "email": "string (opcional)",
    "avatar": "file (opcional)",
    "myHouseLocation": "string (opcional)",
    "myWorkLocation": "string (opcional)"
  }
  ```

### Recordatorios

- **GET /api/v1/reminders**: Obtener todos los recordatorios
- **POST /api/v1/reminders**: Crear recordatorio
- **PUT /api/v1/reminders/:id**: Actualizar recordatorio
- **DELETE /api/v1/reminders/:id**: Eliminar recordatorio

### Lugares

- **GET /api/v1/places**: Obtener lugares
- **POST /api/v1/places**: Crear lugar
- **PUT /api/v1/places/:id**: Actualizar lugar
- **DELETE /api/v1/places/:id**: Eliminar lugar

## Guía de Implementación

### Manejo de Archivos con Cloudinary

```javascript
// Configuración de Cloudinary
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Middleware de Multer para subida de archivos
const upload = multer({
  storage: multerStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Formato no soportado'), false);
    }
  }
});
```

### Autenticación JWT

```javascript
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '1y'
  });
};
```

## Seguridad

- Implementación de JWT para autenticación
- Hash de contraseñas con bcrypt
- Validación de tipos de archivo
- Sanitización de datos de entrada
- Manejo seguro de variables de entorno

## Manejo de Errores

- Implementación de try-catch en controladores
- Respuestas de error estandarizadas
- Logging de errores
- Validación de datos de entrada

## Contribución

1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/NuevaCaracteristica`)
3. Commit cambios (`git commit -m 'Añadir nueva característica'`)
4. Push a la rama (`git push origin feature/NuevaCaracteristica`)
5. Crear Pull Request

## Licencia

Este proyecto está bajo la Licencia (Tu Licencia) - mira el archivo [LICENSE.md](LICENSE.md) para detalles

---

**⌨️ por [kiger22](https://github.com/Kiger22)**

## Modelos de Datos

### Usuario

```javascript
{
  username: String,       // required, unique
  password: String,       // required, hashed
  role: String,          // enum: ["admin", "user"]
  name: String,
  email: String,
  avatar: String,
  myHouseLocation: String,
  myWorkLocation: String,
  myFavoritesLocations: [ObjectId]
}
```

### Recordatorio

```javascript
{
  userId: ObjectId,      // required, ref: 'users'
  name: String,          // required
  description: String,   // required
  date: Date,           // required
  time: String,         // required
  location: String,     // required
  radius: Number,       // default: 50
  active: Boolean,      // default: true
  notifications: [ObjectId]
}
```

### Lugar

```javascript
{
  name: String,         // required
  category: ObjectId,   // ref: 'locationCategories'
  description: String,
  location: String,     // required
  address: String,
  isFavorite: Boolean,  // default: false
  useCount: Number      // default: 0
}
```

## Middlewares

### Autenticación

```javascript
// Ejemplo de uso
router.get('/protected', [isAuth], controller);
router.get('/admin', [isAdmin], controller);
```

### Manejo de Archivos

```javascript
// Ejemplo de uso
router.post('/upload', upload('avatars').single('avatar'), controller);
```

## Testing

```bash
# Ejecutar pruebas de Cloudinary
npm run test

# Ejecutar pruebas de hash
npm run testhash
```

## Despliegue

### Preparación para Producción

1. Configurar variables de entorno:

```plaintext
NODE_ENV=production
PORT=3001
MONGODB_URI=tu_uri_produccion
```

2. Construir la aplicación:

```bash
npm run build
```

3. Iniciar en producción:

```bash
npm start
```

## Integración con Frontend

### CORS Configuration

```javascript
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
```

### Endpoints para Frontend

- Autenticación: `POST /api/v1/users/login`
- Registro: `POST /api/v1/users/register`
- Recordatorios: `GET /api/v1/reminders`
- Lugares: `GET /api/v1/places`

### Manejo de Respuestas

Todas las respuestas siguen el formato:

```javascript
{
  success: boolean,
  data?: any,
  error?: string,
  message?: string
}
```

## Monitoreo y Logs

- Implementar sistema de logging
- Monitoreo de endpoints
- Gestión de errores en producción
