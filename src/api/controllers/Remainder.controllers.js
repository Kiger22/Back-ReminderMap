const Reminder = require("../models/Reminder.model");

// Crear un recordatorio
const createReminder = async (req, res) => {
  try {
    const reminder = new Reminder(req.body);
    const savedReminder = await reminder.save();
    res.status(201).json(savedReminder);
  }
  catch (error) {
    res.status(400).json({ message: 'Error al crear el recordatorio', error });
  }
};

// Obtener todos los recordatorios de un usuario
const getRemindersByUser = async (req, res) => {
  try {
    const { userId } = req.params.userId;
    const reminders = await Reminder.find({ userId });
    res.status(200).json(reminders);
  }
  catch (error) {
    res.status(500).json({ message: 'Error al obtener recordatorios', error });
  }
};

// Obtener un recordatorio por ID
const getReminderById = async (req, res) => {
  try {
    const { id } = req.params;
    const reminder = await Reminder.findById(id);

    if (!reminder) return res.status(404).json({ message: 'Recordatorio no encontrado' });
    res.status(200).json(reminder);
  }
  catch (error) {
    res.status(500).json({ message: 'Error al obtener el recordatorio', error });
  }
};

// Actualizar un recordatorio
const updateReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedReminder = await Reminder.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!updatedReminder) return res.status(404).json({ message: 'Recordatorio no encontrado' });
    res.status(200).json(updatedReminder);
  }
  catch (error) {
    res.status(400).json({ message: 'Error al actualizar el recordatorio', error });
  }
};

// Eliminar un recordatorio
const deleteReminder = async (req, res) => {
  try {
    const { Id } = req.params;
    const deletedReminder = await Reminder.findByIdAndDelete(Id);

    if (!deletedReminder) return res.status(404).json({ message: 'Recordatorio no encontrado' });
    res.status(200).json({ message: 'Recordatorio eliminado' });
  }
  catch (error) {
    res.status(500).json({ message: 'Error al eliminar el recordatorio', error });
  }
};

module.exports = {
  createReminder,
  getRemindersByUser,
  getReminderById,
  updateReminder,
  deleteReminder
};
