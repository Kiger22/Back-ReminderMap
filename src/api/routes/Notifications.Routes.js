const express = require('express');
const notificationsRoutes = express.Router();
const {
  createNotification,
  getNotificationsByUser,
  markNotificationAsRead,
  deleteNotification
} = require('../controllers/Notification.controllers');

// Rutas para las notificaciones
notificationsRoutes.post('/', createNotification);
notificationsRoutes.get('/:userId', getNotificationsByUser);
notificationsRoutes.put('/:id/read', markNotificationAsRead);
notificationsRoutes.delete('/:id', deleteNotification);

module.exports = notificationsRoutes;
