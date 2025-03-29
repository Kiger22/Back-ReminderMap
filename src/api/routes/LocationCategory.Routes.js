const express = require('express');
const locationCategoryRoutes = express.Router();
const {
  createLocationCategory,
  getLocationCategory,
  getLocationCategoryById,
  updateLocationCategory,
  deleteLocationCategory
} = require('../controllers/LocationCategory.controllers');

locationCategoryRoutes.post('/', createLocationCategory);
locationCategoryRoutes.get('/', getLocationCategory);
locationCategoryRoutes.get('/:id', getLocationCategoryById);
locationCategoryRoutes.put('/:id', updateLocationCategory);
locationCategoryRoutes.delete('/:id', deleteLocationCategory);

module.exports = locationCategoryRoutes;
