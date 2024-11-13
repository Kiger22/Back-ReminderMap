const mongoose = require('mongoose');

const locationCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  place: [{
    type: mongoose.Schema.ObjectId,
    ref: 'places',
    required: false
  }]
}, {
  timestamps: true,
  collection: 'locationCategories'
});

const LocationCategory = mongoose.model('locationCategories', locationCategorySchema, 'locationCategories');

module.exports = LocationCategory;
