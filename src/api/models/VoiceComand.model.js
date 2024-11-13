const mongoose = require('mongoose');

const voiceCommandSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  command: { type: String, required: true },
  processed: { type: Boolean, default: false },
  reminderId: { type: mongoose.Schema.Types.ObjectId, ref: 'reminders' },
}, {
  timestamps: true,
  collection: 'voiceCommands'
});

const VoiceCommand = mongoose.model('voiceCommands', voiceCommandSchema, 'voiceCommands');

module.exports = VoiceCommand;