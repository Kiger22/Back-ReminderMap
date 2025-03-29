const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre es requerido']
  },
  description: String,
  location: {
    type: String,
    required: [true, 'La ubicación es requerida']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'locationCategories',
    required: [true, 'La categoría es requerida']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: [true, 'El ID de usuario es requerido']
  },
  useCount: {
    type: Number,
    default: 0
  },
  isFavorite: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('places', placeSchema);
