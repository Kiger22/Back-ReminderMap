const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  name: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  radius: { type: Number, required: false, default: 50 },
  active: { type: Boolean, default: true },
  notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'notifications' }]
}, {
  timestamps: true,
  collection: 'reminders',
});

const Reminder = mongoose.model('reminders', reminderSchema);

module.exports = Reminder;
