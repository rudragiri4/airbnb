const axios = require('axios');

exports.searchAirbnb = async (req, res) => {
  try {
    const { location, adults = 1, checkIn, checkOut } = req.query;

    console.log('🔍 Searching for:', location);

    const options = {
      method: 'GET',
      url: 'https://airbnb13.p.rapidapi.com/search-location',
      params: {
        location,
        checkin: checkIn || new Date().toISOString().split('T')[0],
        checkout: checkOut || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        adults: String(adults),
        children: '0',
        infants: '0',
        pets: '0',
        page: '1',
        currency: 'USD'
      },
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        'x-rapidapi-host': 'airbnb13.p.rapidapi.com'
      }
    };

    const response = await axios.request(options);
    console.log('✅ Status:', response.status);
    console.log('📦 Keys:', Object.keys(response.data || {}));
    console.log('📦 Sample:', JSON.stringify(response.data).slice(0, 500));
    res.json(response.data);

  } catch (err) {
    console.error('❌ Error:', err.response?.status, JSON.stringify(err.response?.data));
    res.status(500).json({ message: err.message, detail: err.response?.data });
  }
};