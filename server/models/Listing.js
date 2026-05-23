const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  images: [{ type: String }],
  price: { type: Number, required: true },
  location: {
    address: String,
    city: { type: String, required: true },
    country: { type: String, required: true },
    lat: Number,
    lng: Number,
  },
  amenities: [{ type: String }],
  propertyType: {
    type: String,
    enum: ['house', 'apartment', 'villa', 'cabin', 'condo', 'studio'],
    default: 'apartment'
  },
  guests: { type: Number, required: true, default: 1 },
  bedrooms: { type: Number, default: 1 },
  bathrooms: { type: Number, default: 1 },
  beds: { type: Number, default: 1 },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  isAvailable: { type: Boolean, default: true },
  bookedDates: [{ startDate: Date, endDate: Date }],
}, { timestamps: true });

module.exports = mongoose.model('Listing', listingSchema);
