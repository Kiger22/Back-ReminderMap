const mongoose = require('mongoose');

const locationCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  places: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'places'
  }]
}, {
  timestamps: true,
  collection: 'locationCategories'
});

const LocationCategory = mongoose.model('locationCategories', locationCategorySchema, 'locationCategories');

module.exports = LocationCategory;
