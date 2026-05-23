const router = require('express').Router();
const { createReview, getListingReviews, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');
router.post('/', protect, createReview);
router.get('/:listingId', getListingReviews);
router.delete('/:id', protect, deleteReview);
module.exports = router;
