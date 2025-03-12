const express = require('express');
const reminderRoutes = express.Router();
const {
  createReminder,
  getUserReminders,
  updateReminder,
  deleteReminder
} = require('../controllers/Reminder.controllers');

// Rutas para los recordatorios
reminderRoutes.post('/', createReminder);
reminderRoutes.get('/:userId', getUserReminders);
reminderRoutes.put('/:id', updateReminder);
reminderRoutes.delete('/:id', deleteReminder);

module.exports = reminderRoutes;
