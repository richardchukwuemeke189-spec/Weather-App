const express = require('express');
const router = express.Router();

const {
  getWeatherByCity,
  getFiveDayForecast,
  getCityByCoordinates
} = require('../controllers/weatherController');

// Route to get current weather by city name
router.get('/', getWeatherByCity);

// Route to get 5-day forecast by city name
router.get('/forecast', getFiveDayForecast);

// Route to get city name from coordinates
router.get('/geolocate', getCityByCoordinates);

module.exports = router;