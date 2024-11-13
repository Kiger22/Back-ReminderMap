const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  placeId: { type: mongoose.Schema.Types.ObjectId, ref: 'places', required: true },
}, {
  timestamps: true,
  collection: 'favorites',
});

const Favorite = mongoose.model('favorites', favoriteSchema, 'favorites');

module.exports = Favorite;
