const Listing = require('../models/Listing');
const Booking = require('../models/Booking');

exports.getHostStats = async (req, res) => {
  try {
    const listings = await Listing.find({ host: req.user._id });
    const listingIds = listings.map(l => l._id);

    const bookings = await Booking.find({ host: req.user._id })
      .populate('listing', 'title images price')
      .populate('guest', 'name avatar email')
      .sort({ createdAt: -1 });

    const totalRevenue = bookings
      .filter(b => b.paymentStatus === 'paid')
      .reduce((sum, b) => sum + b.totalPrice, 0);

    res.json({
      totalListings: listings.length,
      totalBookings: bookings.length,
      totalRevenue,
      recentBookings: bookings.slice(0, 10),
      listings
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getHostBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ host: req.user._id })
      .populate('listing', 'title images')
      .populate('guest', 'name avatar email')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    booking.status = req.body.status;
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
