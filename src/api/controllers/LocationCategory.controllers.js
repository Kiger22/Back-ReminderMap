const LocationCategory = require("../models/LocationCategory.model");
const mongoose = require('mongoose');

//? Crear una categoría
const createLocationCategory = async (req, res) => {
  try {
    const { name, description, userId } = req.body;

    console.log('Datos recibidos en el servidor:', req.body);

    // Validamos que se proporcionen el nombre y userId
    if (!name || !userId) {
      return res.status(400).json({
        message: 'El nombre y userId son requeridos',
        success: false
      });
    }

    // Validamos que el userId es válido
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: 'userId inválido',
        success: false
      });
    }

    // Creamos la categoría
    const locationCategory = new LocationCategory({
      name,
      description: description || '',
      userId,
      places: [] // Inicializamos el array de lugares
    });

    // Guardamos la categoría y la devolvemos
    const savedCategory = await locationCategory.save();

    return res.status(201).json({
      message: 'Categoría creada exitosamente',
      category: savedCategory,
      success: true
    });
  }
  catch (error) {
    console.error('Error detallado al crear categoría:', error);
    return res.status(500).json({
      message: 'Error al crear la categoría',
      error: error.message,
      success: false
    });
  }
};

//? Obtener todas las categorías
const getLocationCategory = async (req, res) => {
  try {
    const { userId } = req.query;

    console.log('Solicitud de categorías recibida. UserId:', userId);

    // Construimos la consulta para buscar categorías
    const query = userId ? { userId } : {};
    console.log('Consulta para buscar categorías:', query);

    // Buscamos las categorías y las devolvemos ordenadas por fecha de creación
    const locationCategories = await LocationCategory.find(query)
      .populate('places', 'name location')
      .sort({ createdAt: -1 });

    console.log(`Se encontraron ${locationCategories.length} categorías`);

    res.status(200).json({
      categories: locationCategories,
      success: true
    });
  }
  catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({
      message: 'Error al obtener categorías',
      error: error.message,
      success: false
    });
  }
};

//? Obtener una categoría por ID
const getLocationCategoryById = async (req, res) => {
  try {
    // Buscamos la categoría por ID y la devolvemos
    const { id } = req.params;
    console.log('Solicitud de categoría por ID recibida:', id);

    const category = await LocationCategory.findById(id)
      .populate('places', 'name location description');

    // Si no se encuentra la categoría, devolvemos un error
    if (!category) {
      return res.status(404).json({
        message: 'Categoría no encontrada',
        success: false
      });
    }

    console.log('Categoría encontrada:', category);

    // Devolvemos la categoría
    res.status(200).json({
      category,
      success: true
    });
  }
  catch (error) {
    res.status(500).json({
      message: 'Error al obtener la categoría',
      error: error.message,
      success: false
    });
  }
};

//? Actualizar una categoría
const updateLocationCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { placeId, action, name, description } = req.body;

    const category = await LocationCategory.findById(id);

    // Si no se encuentra la categoría, devolver un error
    if (!category) {
      return res.status(404).json({
        message: 'Categoría no encontrada',
        success: false
      });
    }

    // Si se proporcionan datos básicos, actualizarlos
    if (name) category.name = name;
    if (description) category.description = description;

    // Si se proporciona placeId y action, manejar lugares
    if (placeId && action) {
      if (action === 'add' && !category.places.includes(placeId)) {
        category.places.push(placeId);
      } else if (action === 'remove') {
        category.places = category.places.filter(place =>
          place.toString() !== placeId.toString()
        );
      }
    }

    await category.save();

    // Obtener la categoría actualizada con los lugares populados
    const updatedCategory = await LocationCategory.findById(id)
      .populate('places', 'name location description');

    res.status(200).json({
      message: 'Categoría actualizada correctamente',
      category: updatedCategory,
      success: true
    });
  } catch (error) {
    console.error('Error en updateLocationCategory:', error);
    res.status(500).json({
      message: 'Error al actualizar la categoría',
      error: error.message,
      success: false
    });
  }
};

//? Eliminar categoría
const deleteLocationCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategory = await LocationCategory.findByIdAndDelete(id);

    // Si no se encuentra la categoría, devolver un error
    if (!deletedCategory) {
      return res.status(404).json({
        message: 'Categoría no encontrada',
        success: false
      });
    }

    // Devolver un mensaje de éxito
    res.status(200).json({
      message: 'Categoría eliminada correctamente',
      success: true
    });
  }
  catch (error) {
    res.status(500).json({
      message: 'Error al eliminar la categoría',
      error: error.message,
      success: false
    });
  }
};

module.exports = {
  createLocationCategory,
  getLocationCategory,
  getLocationCategoryById,
  updateLocationCategory,
  deleteLocationCategory,
};
