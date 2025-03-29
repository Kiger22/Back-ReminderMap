const Favorite = require("../models/Favorites.model");
const Place = require("../models/Places.model");
const User = require("../models/User.model");

//? Crear un favorito
const createFavorite = async (req, res) => {
  try {
    const { userId, placeId } = req.body;

    // Creamos el favorito
    const favorite = new Favorite({ userId, placeId });
    const savedFavorite = await favorite.save();

    // Actualizamos el campo isFavorite en el lugar
    await Place.findByIdAndUpdate(placeId, { isFavorite: true });

    // Actualizamos myFavoritesLocations del usuario
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { myFavoritesLocations: savedFavorite._id } }
    );

    res.status(201).json(savedFavorite);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear favorito', error });
  }
};

//? Obtener favoritos de un usuario
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

//? Eliminar un favorito
const deleteFavorite = async (req, res) => {
  try {
    const { userId, placeId } = req.params;

    console.log('Intentando eliminar favorito:', { userId, placeId }); // Para debugging

    // Verificamos que exista el favorito antes de eliminarlo
    const existingFavorite = await Favorite.findOne({
      userId: userId,
      placeId: placeId
    });

    if (!existingFavorite) {
      console.log('Favorito no encontrado para:', { userId, placeId }); // Para debugging
      return res.status(404).json({ message: 'Favorito no encontrado' });
    }

    // Eliminamos el favorito
    const deletedFavorite = await Favorite.findOneAndDelete({
      userId: userId,
      placeId: placeId
    });

    // Actualizamos el campo isFavorite en el lugar
    await Place.findByIdAndUpdate(placeId, { isFavorite: false });

    // Removemos el favorito de myFavoritesLocations del usuario
    await User.findByIdAndUpdate(
      userId,
      { $pull: { myFavoritesLocations: existingFavorite._id } }
    );

    res.status(200).json({ message: 'Favorito eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar favorito:', error); // Para debugging
    res.status(500).json({
      message: 'Error al eliminar favorito',
      error: error.message
    });
  }
};

module.exports = {
  createFavorite,
  getFavoritesByUser,
  deleteFavorite
};
