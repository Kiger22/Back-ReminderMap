const express = require('express');
const favoritesRoutes = express.Router();
const {
  createFavorite,
  getFavoritesByUser,
  deleteFavorite
} = require('../controllers/Favorite.controllers');

// Rutas para los favoritos
favoritesRoutes.post('/', createFavorite);
favoritesRoutes.get('/:userId', getFavoritesByUser);
favoritesRoutes.delete('/:userId/:placeId', deleteFavorite);

module.exports = favoritesRoutes;
