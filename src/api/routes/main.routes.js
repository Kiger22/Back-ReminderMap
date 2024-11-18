const express = require('express');
const mainRoutes = express.Router();

// Importar rutas individuales
const placesRoutes = require('./Places.routes');
const favoritesRoutes = require('./Favorites.Routes');
const locationCategoryRoutes = require('./LocationCategory.Routes');
const reminderRoutes = require('./Reminder.Routes');
const notificationsRoutes = require('./Notifications.Routes');
const userRoutes = require('./User.routes');

// Usar las rutas
mainRoutes.use('/places', placesRoutes);
mainRoutes.use('/favorites', favoritesRoutes);
mainRoutes.use('/categories', locationCategoryRoutes);
mainRoutes.use('/reminders', reminderRoutes);
mainRoutes.use('/notifications', notificationsRoutes);
mainRoutes.use('/users', userRoutes);

module.exports = mainRoutes;
