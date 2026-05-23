const router = require('express').Router();
const { searchAirbnb } = require('../controllers/searchController');
router.get('/', searchAirbnb);
module.exports = router;
