const LocationCategory = require("../models/LocationCategory.model");

// Crear una categoría
const createLocationCategory = async (req, res) => {
  try {
    const locationCategory = new LocationCategory(req.body);
    const savedCategory = await locationCategory.save();
    res.status(201).json(savedCategory);
  }
  catch (error) {
    res.status(400).json({ message: 'Error al crear la categoría', error });
  }
};

// Obtener todas las categorías
const getLocationCategory = async (req, res) => {
  try {
    const locationCategory = await LocationCategory.find();
    res.status(200).json(locationCategory);
  }
  catch (error) {
    res.status(500).json({ message: 'Error al obtener categorías', error });
  }
};

// Obtener una categoría por ID
const getLocationCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const locationCategory = await LocationCategory.findById(req.params.id);

    if (!locationCategory) return res.status(404).json({ message: 'Categoría no encontrada' });
    res.status(200).json(locationCategory);
  }
  catch (error) {
    res.status(500).json({ message: 'Error al obtener la categoría', error });
  }
};

// Actualizar una categoría
const updateLocationCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedLocationCategory = await LocationCategory.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!updatedLocationCategory) return res.status(404).json({ message: 'Categoría no encontrada' });
    res.status(200).json(updatedLocationCategory);
  }
  catch (error) {
    res.status(400).json({ message: 'Error al actualizar la categoría', error });
  }
};

// Eliminar una categoría
const deleteLocationCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategory = await LocationCategory.findByIdAndDelete(id);
    if (!deletedCategory) return res.status(404).json({ message: 'Categoría no encontrada' });
    res.status(200).json({ message: 'Categoría eliminada' });
  }
  catch (error) {
    res.status(500).json({ message: 'Error al eliminar la categoría', error });
  }
};

module.exports = {
  createLocationCategory,
  getLocationCategory,
  getLocationCategoryById,
  updateLocationCategory,
  deleteLocationCategory,
};
