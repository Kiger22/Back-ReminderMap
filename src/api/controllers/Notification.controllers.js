const Notification = require("../models/Notification.model");

//? Crear una nueva notificación
const createNotification = async (req, res) => {
  try {
    const notification = new Notification(req.body);
    const savedNotification = await notification.save();
    res.status(201).json(savedNotification);
  }
  catch (error) {
    res.status(400).json({ message: 'Error al crear la notificación', error });
  }
};

//? Obtener todas las notificaciones de un usuario
const getNotificationsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.find({ userId: userId });
    res.status(200).json(notifications);
  }
  catch (error) {
    res.status(500).json({ message: 'Error al obtener notificaciones', error });
  }
};

//? Marcar una notificación como leída
const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedNotification = await Notification.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );

    if (!updatedNotification) return res.status(404).json({ message: 'Notificación no encontrada' });
    res.status(200).json(updatedNotification);
  }
  catch (error) {
    res.status(500).json({ message: 'Error al actualizar la notificación', error });
  }
};

//? Eliminar una notificación
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedNotification = await Notification.findByIdAndDelete(id);

    if (!deletedNotification) return res.status(404).json({ message: 'Notificación no encontrada' });
    res.status(200).json({ message: 'Notificación eliminada' });
  }
  catch (error) {
    res.status(500).json({ message: 'Error al eliminar la notificación', error });
  }
};

module.exports = {
  createNotification,
  getNotificationsByUser,
  markNotificationAsRead,
  deleteNotification
};
