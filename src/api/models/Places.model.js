const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  name: { type: String, required: true },       // Nombre del lugar, ej: "Biblioteca Nacional"
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'locationCategories'                   // Cambiado de 'categories' a 'locationCategories'
  },                                            // Categoría del lugar
  description: { type: String },                // Descripción opcional del lugar
  location: { type: String, required: true },   // Ubicación del lugar, ej: "Calle 24 # 5-60"
  address: { type: String },                    // Dirección opcional
  isFavorite: { type: Boolean, default: false }, // Campo para marcar como favorito
  useCount: { type: Number, default: 0 },       // Contador de uso del lugar
}, {
  timestamps: true,
  collection: 'places',
});

const Place = mongoose.model('places', placeSchema, 'places');

module.exports = Place;
