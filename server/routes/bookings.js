const router = require('express').Router();
const { createBooking, getMyBookings, cancelBooking, getBookingById } = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');
router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/:id', protect, getBookingById);
router.put('/:id/cancel', protect, cancelBooking);
module.exports = router;
