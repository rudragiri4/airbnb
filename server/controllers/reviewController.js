const Review = require('../models/Review');
const Listing = require('../models/Listing');

exports.createReview = async (req, res) => {
  try {
    const { listingId, bookingId, rating, comment, categories } = req.body;
    const existing = await Review.findOne({ booking: bookingId });
    if (existing) return res.status(400).json({ message: 'Already reviewed' });

    const review = await Review.create({
      listing: listingId, author: req.user._id,
      booking: bookingId, rating, comment, categories
    });

    // Update listing average rating
    const reviews = await Review.find({ listing: listingId });
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Listing.findByIdAndUpdate(listingId, { rating: avg.toFixed(1), reviewCount: reviews.length });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getListingReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ listing: req.params.listingId })
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await review.deleteOne();
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
