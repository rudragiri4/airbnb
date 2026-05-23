const Listing = require('../models/Listing');
const cloudinary = require('../middleware/cloudinary');

exports.getAllListings = async (req, res) => {
  try {
    const { city, minPrice, maxPrice, guests, propertyType, page = 1, limit = 12 } = req.query;
    const filter = {};
    if (city) filter['location.city'] = { $regex: city, $options: 'i' };
    if (propertyType) filter.propertyType = propertyType;
    if (guests) filter.guests = { $gte: Number(guests) };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const listings = await Listing.find(filter)
      .populate('host', 'name avatar')
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Listing.countDocuments(filter);
    res.json({ listings, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('host', 'name avatar bio');
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createListing = async (req, res) => {
  try {
    const listing = await Listing.create({ ...req.body, host: req.user._id });
    res.status(201).json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (listing.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const updated = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (listing.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await listing.deleteOne();
    res.json({ message: 'Listing deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.uploadImages = async (req, res) => {
  try {
    const urls = [];
    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, { folder: 'airbnb-clone' });
      urls.push(result.secure_url);
    }
    res.json({ urls });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
