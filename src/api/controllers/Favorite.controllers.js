const Favorite = require("../models/Favorites.model");

// Crear un favorito
const createFavorite = async (req, res) => {
  try {
    const favorite = new Favorite(req.body);
    const savedFavorite = await favorite.save();
    res.status(201).json(savedFavorite);
  }
  catch (error) {
    res.status(400).json({ message: 'Error al crear favorito', error });
  }
};

// Obtener favoritos de un usuario
const getFavoritesByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const favorites = await Favorite.find({ userId: userId }).populate('placeId');
    res.status(200).json(favorites);
  }
  catch (error) {
    res.status(500).json({ message: 'Error al obtener favoritos', error });
  }
};

// Eliminar un favorito
const deleteFavorite = async (req, res) => {
  try {
    const { userId } = req.params.userId;
    const { placeId } = req.params.placeId
    const deletedFavorite = await Favorite.findOneAndDelete({ userId: userId, placeId: req.params.placeId });
    if (!deletedFavorite) return res.status(404).json({ message: 'Favorito no encontrado' });
    res.status(200).json({ message: 'Favorito eliminado' });
  }
  catch (error) {
    res.status(500).json({ message: 'Error al eliminar favorito', error });
  }
};

module.exports = {
  createFavorite,
  getFavoritesByUser,
  deleteFavorite
};
