# KGR Reminder Map - Backend

## Descripción

Backend para la aplicación KGR Reminder Map, un sistema de gestión de recordatorios basados en geolocalización. Esta API RESTful proporciona todas las funcionalidades necesarias para gestionar usuarios, recordatorios, lugares, categorías y notificaciones.

## Características Principales

- **Autenticación de Usuarios**: Registro e inicio de sesión de usuarios
- **Gestión de Recordatorios**: CRUD para recordatorios que se activan en ubicaciones específicas
- **Lugares y Favoritos**: Posibilidad de añadir lugares de interés y marcarlos como favoritos
- **Categorías de Ubicación**: Organización de lugares por categorías personalizadas
- **Notificaciones**: Notificaciones automáticas basadas en la ubicación del usuario
- **Gestión de Archivos**: Integración con Cloudinary para almacenamiento de imágenes
- **Perfiles de Usuario**: Gestión completa de perfiles con avatares y ubicaciones personalizadas
- **Limpieza Automática**: Eliminación automática de recordatorios vencidos

## Tecnologías Utilizadas

- Node.js y Express.js para el servidor
- MongoDB y Mongoose para la base de datos
- JWT para autenticación
- Bcrypt para encriptación de contraseñas
- Cloudinary para almacenamiento de archivos
- Multer para manejo de formularios multipart
- Cors para gestión de CORS

## Estructura del Proyecto

```bash
src/
├── api/
│   ├── controllers/     # Controladores de cada recurso
│   │   ├── User.controllers.js
│   │   ├── Reminder.controllers.js
│   │   ├── Place.controllers.js
│   │   ├── LocationCategory.controllers.js
│   │   ├── Notification.controllers.js
│   │   └── ...
│   ├── models/         # Esquemas de Mongoose
│   │   ├── User.model.js
│   │   ├── Reminder.model.js
│   │   ├── Places.model.js
│   │   ├── LocationCategory.model.js
│   │   ├── Notification.model.js
│   │   └── ...
│   └── routes/         # Definición de rutas
│       ├── User.routes.js
│       ├── Reminder.Routes.js
│       ├── Places.routes.js
│       ├── LocationCategory.Routes.js
│       ├── Notifications.Routes.js
│       └── main.routes.js
├── config/             # Configuraciones
│   ├── db.js          # Configuración MongoDB
│   ├── cldry.js       # Configuración Cloudinary
│   └── jwt.js         # Configuración JWT
├── functions/         # Funciones de utilidad
│   └── reminderCleanup.js # Limpieza automática de recordatorios
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

## API Endpoints

### Autenticación

- **POST /api/v1/users/register**: Registro de usuario
- **POST /api/v1/users/login**: Inicio de sesión

### Usuarios

- **GET /api/v1/users/:id**: Obtener usuario por ID
- **PUT /api/v1/users/:id**: Actualizar usuario
- **DELETE /api/v1/users/:id**: Eliminar usuario

### Recordatorios

- **GET /api/v1/reminders/:userId**: Obtener recordatorios de un usuario
- **POST /api/v1/reminders**: Crear recordatorio
- **PUT /api/v1/reminders/:id**: Actualizar recordatorio
- **DELETE /api/v1/reminders/:id**: Eliminar recordatorio

### Lugares

- **GET /api/v1/places**: Obtener todos los lugares
- **GET /api/v1/places/user/:userId**: Obtener lugares de un usuario
- **POST /api/v1/places**: Crear lugar
- **PUT /api/v1/places/:id**: Actualizar lugar
- **DELETE /api/v1/places/:id**: Eliminar lugar
- **PUT /api/v1/places/:id/increment-use**: Incrementar contador de uso

### Categorías

- **GET /api/v1/categories**: Obtener todas las categorías
- **GET /api/v1/categories/:id**: Obtener categoría por ID
- **POST /api/v1/categories**: Crear categoría
- **PUT /api/v1/categories/:id**: Actualizar categoría
- **DELETE /api/v1/categories/:id**: Eliminar categoría

### Notificaciones

- **GET /api/v1/notifications/:userId**: Obtener notificaciones de un usuario
- **POST /api/v1/notifications**: Crear notificación
- **PUT /api/v1/notifications/:id**: Marcar notificación como leída
- **DELETE /api/v1/notifications/:id**: Eliminar notificación

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
  userId: ObjectId,      // required, ref: 'users'
  name: String,          // required
  description: String,
  location: String,      // required
  category: ObjectId,    // ref: 'locationCategories'
  useCount: Number,      // default: 0
  isFavorite: Boolean    // default: false
}
```

## Seguridad

- Implementación de JWT para autenticación
- Hash de contraseñas con bcrypt
- Validación de tipos de archivo
- Sanitización de datos de entrada
- Manejo seguro de variables de entorno

## Mantenimiento Automático

### Limpieza de Recordatorios

El sistema incluye un mecanismo automático para eliminar recordatorios vencidos:

- Se ejecuta al iniciar el servidor y luego cada 24 horas
- Elimina recordatorios cuya fecha y hora ya han pasado
- Actualiza los contadores de uso de lugares asociados
- Registra información detallada en los logs del sistema

## Contribución

1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/NuevaCaracteristica`)
3. Commit cambios (`git commit -m 'Añadir nueva característica'`)
4. Push a la rama (`git push origin feature/NuevaCaracteristica`)
5. Crear Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para detalles

---

**⌨️ por [kiger22](https://github.com/Kiger22)**

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

2.Construir la aplicación:

```bash
npm run build
```

3.Iniciar en producción:

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
