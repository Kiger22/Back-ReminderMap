const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },                                                                             // ID del usuario que creó el recordatorio
  title: { type: String, required: true },                                       // Título del recordatorio
  description: { type: String },                                                 // Descripción opcional del recordatorio
  date: { type: Date, required: false },                                          // Fecha del recordatorio (opcional)
  location: {
    type: { type: String, enum: ['exact', 'category'], required: true },         // Ubicación del recordatorio
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }                                                       // "exact" para coordenadas o "category" para categorías como "supermercado"
    },
    category: [{ type: mongoose.Schema.Types.ObjectId, ref: 'locationCategories' }]                                                    // e.g., "biblioteca", "restaurante", "supermercado"
  },
  radius: { type: Number, required: false, default: 50 },                         // Radio de activación en metros (para geofencing)
  active: { type: Boolean, default: true },                                       // Estado del recordatorio (activo o inactivo)
  notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'notifications' }]  // IDs de las notificaciones enviadas para este recordatorio
}, {
  timestamps: true,
  collection: 'reminders',
});

const Reminder = mongoose.model('reminders', reminderSchema, 'reminders');

module.exports = Reminder;
