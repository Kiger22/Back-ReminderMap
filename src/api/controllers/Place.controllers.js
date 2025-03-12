const Place = require("../models/Places.model");
const LocationCategory = require("../models/LocationCategory.model");
const mongoose = require("mongoose");

//*Creamos un nuevo lugar
const createPlace = async (req, res, next) => {
  try {
    const { name, description, location, category } = req.body;

    // Validaciones
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ mensaje: "Nombre del lugar inválido", éxito: false });
    }
    if (!description || typeof description !== 'string') {
      return res.status(400).json({ mensaje: "Descripción inválida", éxito: false });
    }
    if (!location || typeof location !== 'string') {
      return res.status(400).json({ mensaje: "Ubicación inválida", éxito: false });
    }
    if (!category || typeof category !== 'string') {
      return res.status(400).json({ mensaje: "Categoría inválida", éxito: false });
    }

    // Creamos y guardamos el nuevo lugar
    const newPlace = new Place({
      name,
      description,
      location,
      category,
      createdAt: new Date()
    });

    const savedPlace = await newPlace.save();

    return res.status(201).json({
      mensaje: "Lugar creado correctamente",
      lugar: savedPlace,
      éxito: true
    });
  }
  catch (error) {
    return res.status(500).json({
      mensaje: "Error al crear lugar",
      error: error.message,
      éxito: false
    });
  }
};

//*Obtenemos lugares con filtros y paginación
const getPlaces = async (req, res, next) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;

    // Construimos filtros dinámicamente
    const filters = {};
    if (category) filters.category = category;
    if (search) filters.name = { $regex: search, $options: 'i' };

    // Obtenemos lugares con filtros y paginación
    const places = await Place
      .find(filters)
      .populate({
        path: 'category',
        model: 'locationCategories',
        select: 'name description'
      })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ useCount: -1, createdAt: -1 });

    // Contamos total de lugares para paginación
    const totalPlaces = await Place.countDocuments(filters);

    return res.status(200).json({
      lugares: places,
      total: totalPlaces,
      página: parseInt(page),
      límite: parseInt(limit),
      éxito: true
    });
  }
  catch (error) {
    console.error('Error en getPlaces:', error);
    return res.status(500).json({
      mensaje: "Error al obtener lugares",
      error: error.message,
      éxito: false
    });
  }
};

//*Obtenemos un lugar por ID
const getPlaceById = async (req, res, next) => {
  try {
    const placeId = req.params.id;

    // Validamos el ID del lugar
    if (!mongoose.Types.ObjectId.isValid(placeId)) {
      return res.status(400).json({ mensaje: "ID de lugar inválido", éxito: false });
    }

    const place = await Place.findById(placeId);

    if (!place) {
      return res.status(404).json({ mensaje: "Lugar no encontrado", éxito: false });
    }

    return res.status(200).json({
      lugar: place,
      éxito: true
    });
  }
  catch (error) {
    return res.status(500).json({
      mensaje: "Error al obtener lugar",
      error: error.message,
      éxito: false
    });
  }
};

//*Actualizamos un lugar
const updatePlace = async (req, res, next) => {
  try {
    const placeId = req.params.id;

    // Validamos el ID del lugar
    if (!mongoose.Types.ObjectId.isValid(placeId)) {
      return res.status(400).json({ mensaje: "ID de lugar inválido", éxito: false });
    }

    // Validamos los campos
    const updates = {};
    if (req.body.name && typeof req.body.name === 'string') updates.name = req.body.name;
    if (req.body.description && typeof req.body.description === 'string') updates.description = req.body.description;
    if (req.body.location && typeof req.body.location === 'string') updates.location = req.body.location;
    if (req.body.category && typeof req.body.category === 'string') updates.category = req.body.category;

    const updatedPlace = await Place.findByIdAndUpdate(placeId, updates, { new: true });

    if (!updatedPlace) {
      return res.status(404).json({ mensaje: "Lugar no encontrado", éxito: false });
    }

    return res.status(200).json({
      mensaje: "Lugar actualizado correctamente",
      lugar: updatedPlace,
      éxito: true
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al actualizar lugar",
      error: error.message,
      éxito: false
    });
  }
};

//*Eliminamos un lugar
const deletePlace = async (req, res, next) => {
  try {
    const placeId = req.params.id;

    // Validamos el ID del lugar
    if (!mongoose.Types.ObjectId.isValid(placeId)) {
      return res.status(400).json({ mensaje: "ID de lugar inválido", éxito: false });
    }

    const deletedPlace = await Place.findByIdAndDelete(placeId);

    if (!deletedPlace) {
      return res.status(404).json({ mensaje: "Lugar no encontrado", éxito: false });
    }

    return res.status(200).json({
      mensaje: "Lugar eliminado correctamente",
      éxito: true
    });
  }
  catch (error) {
    return res.status(500).json({
      mensaje: "Error al eliminar lugar",
      error: error.message,
      éxito: false
    });
  }
};

//*Obtenemos lugares favoritos
const getFavoritePlaces = async (req, res) => {
  try {
    const favoritePlaces = await Place.find({ isFavorite: true });
    res.status(200).json(favoritePlaces);
  }
  catch (error) {
    res.status(500).json({ message: 'Error al obtener los lugares favoritos', error });
  }
};

module.exports = {
  createPlace,
  getPlaces,
  getPlaceById,
  updatePlace,
  deletePlace,
  getFavoritePlaces
};
