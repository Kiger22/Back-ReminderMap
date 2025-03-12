const express = require('express');
const placesRoutes = express.Router();
const {
  createPlace,
  getPlaces,
  getPlaceById,
  updatePlace,
  deletePlace,
  getFavoritePlaces } = require('../controllers/Place.controllers');

// Rutas para los lugares
placesRoutes.post('/', createPlace);
placesRoutes.get('/', getPlaces);
placesRoutes.get('/:id', getPlaceById);
placesRoutes.get('/', getFavoritePlaces);
placesRoutes.put('/:id', updatePlace);
placesRoutes.delete('/:id', deletePlace);

module.exports = placesRoutes;
