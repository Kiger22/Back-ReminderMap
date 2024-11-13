const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  reminderId: { type: mongoose.Schema.Types.ObjectId, ref: 'reminders', required: true },
  message: { type: String, required: true },
  sentAt: { type: Date, default: Date.now },
  seen: { type: Boolean, default: false },
}, {
  timestamps: true,
  collection: 'notifications',
});

const Notification = mongoose.model('notifications', notificationSchema, 'notifications');

module.exports = Notification;
