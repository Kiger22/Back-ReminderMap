const express = require('express');
const router = express.Router();
const {
  createPlace,
  getPlaces,
  getPlaceById,
  updatePlace,
  deletePlace,
  getFavoritePlaces,
  getPlacesByUser,
  incrementUseCount
} = require('../controllers/Place.controllers');

// Rutas para los lugares
router.post('/', createPlace);
router.get('/user/:userId', getPlacesByUser);
router.get('/', getPlaces);
router.get('/:id', getPlaceById);
router.get('/favorites', getFavoritePlaces);
router.put('/:id', updatePlace);
router.delete('/:id', deletePlace);

// Ruta para el incremento del contador
router.put('/:id/increment-use', incrementUseCount);

module.exports = router;
