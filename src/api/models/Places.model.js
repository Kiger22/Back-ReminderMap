const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Nombre del lugar, ej: "Biblioteca Nacional"
  location: {
    lat: { type: Number, required: true }, // Latitud del lugar
    lng: { type: Number, required: true }  // Longitud del lugar
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'categories '
  },                                       // Categoría, e.g., "biblioteca"
  address: { type: String },               // Dirección opcional
  description: { type: String },           // Descripción opcional del lugar
}, {
  timestamps: true,
  collection: 'places',
});

const Place = mongoose.model('places', placeSchema, 'places');

module.exports = Place;
