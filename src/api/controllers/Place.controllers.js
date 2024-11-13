const Place = require("../models/Places.model");

// Crear un nuevo lugar
const createPlace = async (req, res) => {
  try {
    const place = new Place(req.body);
    const savedPlace = await place.save();
    res.status(201).json(savedPlace);
  }
  catch (error) {
    res.status(400).json({ message: 'Error al crear el lugar', error });
  }
};

// Obtener todos los lugares
const getPlaces = async (req, res) => {
  try {
    const places = await Place.find();
    res.status(200).json(places);
  }
  catch (error) {
    res.status(500).json({ message: 'Error al obtener lugares', error });
  }
};

// Obtener un lugar por ID
const getPlaceById = async (req, res) => {
  try {
    const { id } = req.params;
    const place = await Place.findById(id);

    if (!place) return res.status(404).json({ message: 'Lugar no encontrado' });
    res.status(200).json(place);
  }
  catch (error) {
    res.status(500).json({ message: 'Error al obtener el lugar', error });
  }
};

// Actualizar un lugar
const updatePlace = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedPlace = await Place.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!updatedPlace) return res.status(404).json({ message: 'Lugar no encontrado' });
    res.status(200).json(updatedPlace);
  }
  catch (error) {
    res.status(400).json({ message: 'Error al actualizar el lugar', error });
  }
};

// Eliminar un lugar
const deletePlace = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPlace = await Place.findByIdAndDelete(id);

    if (!deletedPlace) return res.status(404).json({ message: 'Lugar no encontrado' });
    res.status(200).json({ message: 'Lugar eliminado' });
  }
  catch (error) {
    res.status(500).json({ message: 'Error al eliminar el lugar', error });
  }
};

module.exports = {
  createPlace,
  getPlaces,
  getPlaceById,
  updatePlace,
  deletePlace
};
