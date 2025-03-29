const Reminder = require("../models/Reminder.model");
const mongoose = require("mongoose");

//? Crear un nuevo recordatorio
const createReminder = async (req, res, next) => {
  try {
    const { userId, name, description, date, time, location } = req.body;

    // Validaciones
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ mensaje: "ID de usuario inválido", éxito: false });
    }
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ mensaje: "Nombre del recordatorio inválido", éxito: false });
    }
    if (!description || typeof description !== 'string') {
      return res.status(400).json({ mensaje: "Descripción inválida", éxito: false });
    }
    if (!date || isNaN(Date.parse(date))) {
      return res.status(400).json({ mensaje: "Fecha inválida", éxito: false });
    }
    if (!time || !/^\d{2}:\d{2}$/.test(time)) {
      return res.status(400).json({ mensaje: "Hora inválida", éxito: false });
    }
    if (!location || typeof location !== 'string') {
      return res.status(400).json({ mensaje: "Ubicación inválida", éxito: false });
    }

    // Creamos y guardamos el nuevo recordatorio
    const newReminder = new Reminder({
      userId,
      name,
      description,
      date: new Date(date),
      time,
      location,
      createdAt: new Date()
    });
    const savedReminder = await newReminder.save();

    // Devolvemos el recordatorio creado
    return res.status(201).json({
      mensaje: "Recordatorio creado correctamente",
      recordatorio: savedReminder,
      éxito: true
    });
  }
  catch (error) {
    return res.status(500).json({
      mensaje: "Error al crear recordatorio",
      error: error.message,
      éxito: false
    });
  }
};

//? Obtener recordatorios de un usuario
const getUserReminders = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    // Validamos del ID de usuario
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ mensaje: "ID de usuario inválido", éxito: false });
    }

    // Obtenemos y devolvemos los recordatorios del usuario
    const reminders = await Reminder.find({ userId }).sort({ date: 1, time: 1 });

    return res.status(200).json({
      recordatorios: reminders,
      éxito: true
    });
  }
  catch (error) {
    return res.status(500).json({
      mensaje: "Error al obtener recordatorios",
      error: error.message,
      éxito: false
    });
  }
};

//? Actualizar un recordatorio
const updateReminder = async (req, res, next) => {
  try {
    const reminderId = req.params.id;

    // Validamos del ID de recordatorio
    if (!mongoose.Types.ObjectId.isValid(reminderId)) {
      return res.status(400).json({ mensaje: "ID de recordatorio inválido", éxito: false });
    }

    // Validamos los campos
    const updates = {};
    if (req.body.name && typeof req.body.name === 'string') updates.name = req.body.name;
    if (req.body.description && typeof req.body.description === 'string') updates.description = req.body.description;
    if (req.body.date && !isNaN(Date.parse(req.body.date))) updates.date = new Date(req.body.date);
    if (req.body.time && /^\d{2}:\d{2}$/.test(req.body.time)) updates.time = req.body.time;
    if (req.body.location && typeof req.body.location === 'string') updates.location = req.body.location;

    // Actualizamos el recordatorio
    const updatedReminder = await Reminder.findByIdAndUpdate(reminderId, updates, { new: true });

    // Si no se encuentra el recordatorio, devolvemos un error
    if (!updatedReminder) {
      return res.status(404).json({ mensaje: "Recordatorio no encontrado", éxito: false });
    }

    // Devolvemos el recordatorio actualizado
    return res.status(200).json({
      mensaje: "Recordatorio actualizado correctamente",
      recordatorio: updatedReminder,
      éxito: true
    });
  }
  catch (error) {
    return res.status(500).json({
      mensaje: "Error al actualizar recordatorio",
      error: error.message,
      éxito: false
    });
  }
};

//? Eliminar un recordatorio
const deleteReminder = async (req, res, next) => {
  try {
    const reminderId = req.params.id;

    // Validamos el ID del recordatorio
    if (!mongoose.Types.ObjectId.isValid(reminderId)) {
      return res.status(400).json({ mensaje: "ID de recordatorio inválido", éxito: false });
    }

    // Eliminamos el recordatorio
    const deletedReminder = await Reminder.findByIdAndDelete(reminderId);

    // Si no se encuentra el recordatorio, devolvemos un error
    if (!deletedReminder) {
      return res.status(404).json({ mensaje: "Recordatorio no encontrado", éxito: false });
    }

    // Devolvemos el mensaje de éxito al eliminar el recordatorio
    return res.status(200).json({
      mensaje: "Recordatorio eliminado correctamente",
      éxito: true
    });
  }
  catch (error) {
    return res.status(500).json({
      mensaje: "Error al eliminar recordatorio",
      error: error.message,
      éxito: false
    });
  }
};

module.exports = {
  createReminder,
  getUserReminders,
  updateReminder,
  deleteReminder
};
