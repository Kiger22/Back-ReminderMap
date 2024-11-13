const express = require('express');
const reminderRoutes = express.Router();
const {
  createReminder,
  getRemindersByUser,
  getReminderById,
  updateReminder,
  deleteReminder
} = require('../controllers/Remainder.controllers');

// Rutas para los recordatorios
reminderRoutes.post('/', createReminder);
reminderRoutes.get('/:userId', getRemindersByUser);
reminderRoutes.get('/:id', getReminderById);
reminderRoutes.put('/:id', updateReminder);
reminderRoutes.delete('/:id', deleteReminder);

module.exports = reminderRoutes;
