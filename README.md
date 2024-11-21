# Backend - ReminderMap

Este es el backend de la aplicación **ReminderMap**, una aplicación de recordatorios basada en ubicación que permite a los usuarios recibir notificaciones y recordatorios cuando están en una ubicación específica o cerca de lugares de interés (ej. bibliotecas, restaurantes, supermercados).

## Tabla de Contenidos

- [Descripción](#descripción)
- [Características](#características)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Estructura de Carpetas](#estructura-de-carpetas)
- [Uso](#uso)
- [API Endpoints](#api-endpoints)
- [Contribuciones](#contribuciones)
- [Licencia](#licencia)

---

## Descripción

El backend de **ReminderMap** proporciona una API RESTful desarrollada con Node.js, Express, y MongoDB. Permite a los usuarios crear y gestionar recordatorios basados en ubicación, almacenar lugares favoritos, y recibir notificaciones cuando están en lugares específicos.

## Características

- **Autenticación de Usuarios**: Registro e inicio de sesión de usuarios.
- **Gestión de Recordatorios**: CRUD para recordatorios que se activan en ubicaciones específicas.
- **Lugares y Favoritos**: Posibilidad de añadir lugares de interés y marcarlos como favoritos.
- **Notificaciones**: Notificaciones automáticas basadas en la ubicación del usuario.
- **Carga de Imágenes**: Integración con Cloudinary para el almacenamiento de imágenes.
  
## Tecnologías Utilizadas

- **Node.js** y **Express** para el servidor y API.
- **MongoDB** con Mongoose para la base de datos.
- **Cloudinary** para el almacenamiento de imágenes.
- **JWT** para la autenticación de usuarios.
- **dotenv** para la gestión de variables de entorno.

## Requisitos Previos

- **Node.js** (versión 14 o superior)
- **MongoDB** (instancia local o servicio en la nube)
- Cuenta de **Cloudinary** para el almacenamiento de imágenes

## Instalación

1.Clona el repositorio:

```bash
git clone https://github.com/usuario/ReminderMap-Backend.git
cd ReminderMap-Backend
   ```

2.Instala las dependencias:

```bash
npm install
```

3.Configura las variables de entorno (ver sección Configuración).

### Configuración

Crea un archivo .env en la raíz del proyecto con las siguientes variables de entorno:

```plaintext
PORT=3000
MONGO_URI=mongodb://localhost:27017/remindermap
JWT_SECRET=tu_secreto_de_jwt
CLOUDINARY_CLOUD_NAME=tu_nombre_de_cloudinary
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

- **`PORT`** Puerto en el que se ejecutará el servidor.
- **`MONGO_URI: URI`** de la base de datos MongoDB.
- **`JWT_SECRET:`** Clave secreta para la autenticación JWT.
- **`CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET:`** Credenciales para Cloudinary.

### Estructura de Carpetas

La estructura del proyecto sigue la arquitectura MVC:

```bash
    ├── src
    │   ├── api
    │   │   ├── controllers       # Controladores de cada recurso
    │   │   ├── models            # Esquemas de Mongoose para MongoDB
    │   │   ├── routes            # Definición de rutas de la API
    │   ├── config                # Configuración de base de datos y Cloudinary
    │   ├── data                  # Datos iniciales (seeds)
    │   ├── middlewares           # Middlewares (validación, autenticación, etc.)
    │   ├── utils                 # Utilidades y funciones auxiliares
    │   └── index.js              # Archivo principal del servidor
    └── .env                      # Variables de entorno
```

## Uso

Para iniciar el servidor en modo desarrollo:

```bash
npm run dev
```

El servidor se ejecutará en  **`http://localhost:3000`** (o el puerto que hayas configurado en el archivo .env).

## API Endpoints

Aquí tienes un resumen de los principales endpoints. Todos los endpoints tienen el prefijo **`/api/v1`**.

### Autenticación de Usuarios

- **`POST /users/register`**- Registrar un nuevo usuario.
- **`POST /users/login`** - Iniciar sesión y recibir un token JWT.

### Recordatorios

- **`POST /reminders`**- Crear un nuevo recordatorio.
- **`GET /reminders/:userId`**- Obtener recordatorios de un usuario.
- **`PUT /reminders/:id`**- Actualizar un recordatorio.
- **`DELETE /reminders/:id`**- Eliminar un recordatorio.

### Lugares

- **`POST /places`**- Crear un nuevo lugar.
- **`GET /places`**- Obtener todos los lugares.
- **`GET /places/:id`**- Obtener un lugar por ID.
- **`PUT /places/:id`**- Actualizar un lugar.
- **`DELETE /places/:id`**- Eliminar un lugar.

### Favoritos

- **`POST /favorites`**- Añadir un lugar a favoritos.
- **`GET /favorites/:userId`**- Obtener lugares favoritos de un usuario.
- **`DELETE /favorites/:userId/:placeId`**- Eliminar un lugar de favoritos.

### Notificaciones

- **`POST /notifications`**- Crear una notificación.
- **`GET /notifications/:userId`**- Obtener notificaciones de un usuario.
- **`PUT /notifications/:id/read`**- Marcar una notificación como leída.
- **`DELETE /notifications/:id`**- Eliminar una notificación.

Nota: Algunos endpoints requieren autenticación. Envía el token JWT en el header Authorization: Bearer token.

## Contribuciones

Las contribuciones son bienvenidas. Si deseas contribuir, por favor sigue los siguientes pasos:

- Haz un fork del repositorio.
- Crea una nueva rama para tu funcionalidad (git checkout -b nueva-funcionalidad).
- Haz commit de tus cambios (git commit -m 'Añadir nueva funcionalidad').
- Haz push a la rama (git push origin nueva-funcionalidad).
- Abre un Pull Request.

## Licencia

Este proyecto está bajo la Licencia (Tu Licencia) - mira el archivo [LICENSE.md](LICENSE.md) para detalles

---------

**⌨️ por [kiger22](https://github.com/Kiger22)**
