const express = require('express');
const router = express.Router();

const {
  getWeatherByCity,
  getFiveDayForecast,
  getCityByCoordinates
} = require('../controllers/weatherController');

// ===== Current Weather =====
router.get('/', getWeatherByCity);

// ===== 5-Day Forecast =====
router.get('/forecast', getFiveDayForecast);

// ===== Reverse Geocoding =====
router.get('/geolocate', getCityByCoordinates);

module.exports = router;