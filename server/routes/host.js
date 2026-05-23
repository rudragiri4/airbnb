const router = require('express').Router();
const { getHostStats, getHostBookings, updateBookingStatus } = require('../controllers/hostController');
const { protect, hostOnly } = require('../middleware/auth');
router.get('/stats', protect, hostOnly, getHostStats);
router.get('/bookings', protect, hostOnly, getHostBookings);
router.put('/bookings/:id/status', protect, hostOnly, updateBookingStatus);
module.exports = router;
