import { useEffect, useState, useCallback } from 'react';
import '../style/weatherWidget.css';
import '../style/functionBtn.css';
import { useTheme } from '../context/ThemeContext';
import TimeZone from './TimeZone';
import clear from '../images/sunny.png';
import clouds from '../images/clouds.png';
import rain from '../images/rain.png';
import thunderstorm from '../images/thunderstorm.png';
import drizzle from '../images/drizzle.png';
import snow from '../images/snow.png';
import mist from '../images/mist.png';
import { getFavorites, addFavorite, removeFavorite } from '../utils/favoritesService';

const weatherThemes = {
  Clear: { background: `linear-gradient(#00000012), url(${clear})`, icon: '☀️' },
  Clouds: { background: `url(${clouds})`, icon: '☁️' },
  Rain: { background: `url(${rain})`, icon: '🌧️' },
  Thunderstorm: { background: `url(${thunderstorm})`, icon: '⛈️' },
  Drizzle: { background: `url(${drizzle})`, icon: '🌦️' },
  Snow: { background: `url(${snow})`, icon: '❄️' },
  Mist: { background: `url(${mist})`, icon: '🌫️' }
};

function WeatherWidget({ city }) {
  const { updateTheme } = useTheme();

  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  // Normalize forecast data
  const normalizeForecast = (data) => {
    if (!Array.isArray(data)) return [];
    return data
      .filter(item => (item.dt_txt || item.date || '').includes('12:00:00'))
      .map(item => ({
        date: item.dt_txt || item.date,
        icon: item.icon,
        temp: item.temp,
        description: item.description
      }));
  };

  // Fetch weather (city OR coords)
  const fetchWeather = useCallback(async (params, controller) => {
    try {
      setLoading(true);
      setError('');

      const query = new URLSearchParams(params).toString();
      const baseUrl = `https://weather-backend-001h.onrender.com/api/weather`;

      // Current weather
      const weatherRes = await fetch(`${baseUrl}?${query}`, { signal: controller.signal });
      const weatherData = await weatherRes.json();
      if (!weatherRes.ok) throw new Error(weatherData.error || 'Weather error');

      setWeather(weatherData);
      updateTheme(weatherData, weatherData.sunrise, weatherData.sunset);

      // Forecast
      const forecastRes = await fetch(`${baseUrl}/forecast?${query}`, { signal: controller.signal });
      const forecastData = await forecastRes.json();
      if (!forecastRes.ok) throw new Error(forecastData.error || 'Forecast error');

      setForecast(normalizeForecast(forecastData.forecast));
    } catch (err) {
      if (err.name !== 'AbortError') setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [updateTheme]);

  // Main Effect
  useEffect(() => {
    const controller = new AbortController();
    if (city) {
      fetchWeather({ city }, controller); // ✅ no encodeURIComponent
    } else {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          fetchWeather({ lat: coords.latitude, lon: coords.longitude }, controller);
        },
        () => {
          setError('Location access denied. Please enter a city.');
          setLoading(false);
        }
      );
    }
    return () => controller.abort();
  }, [city, fetchWeather]);

  // Favorites Effect
  useEffect(() => {
    if (!city) return;
    getFavorites()
      .then(favs => setIsFavorite(favs.includes(city)))
      .catch(err => console.error('Favorites error:', err));
  }, [city]);

  const toggleFavorite = async () => {
    if (!city) return;
    try {
      if (isFavorite) {
        await removeFavorite(city);
        setIsFavorite(false);
      } else {
        await addFavorite(city);
        setIsFavorite(true);
      }
    } catch (err) {
      console.error('Favorite update failed:', err);
    }
  };

  // Render
  if (loading) {
    return <div className="weather-widget-wrapper m-5">Loading...</div>;
  }
  if (error) {
    return (
      <div className="weather-error">
        <p>{error}</p>
        <p>You can search for a city manually above.</p>
      </div>
    );
  }
  if (!weather) return null;

  const mainCondition = weather.main || 'Clear';
  const theme = weatherThemes[mainCondition] || weatherThemes['Clear'];

  return (
    <div>
      <TimeZone weather={weather} />
      <div className="weather-widget-wrapper m-5">
        <div className="weather-main">
          <div className="weather-card" style={{ background: theme.background }}>
            <div className="weather-icon">{theme.icon}</div>
            <h3>{weather.city}</h3>
            <p className="weather-temp">{weather.temperature}°C</p>
            <p className="weather-desc">{weather.description}</p>
            <button onClick={toggleFavorite} className="favorite-btn" disabled={!weather}>
              {isFavorite ? '★ Remove Favorite' : '☆ Save Favorite'}
            </button>
          </div>
          <div className="wind-card">
            <h3 className="wind-label">Wind Speed</h3>
            <p className="wind-value">
              {weather.windSpeed !== undefined ? `${weather.windSpeed} m/s` : 'N/A'}
            </p>
          </div>
        </div>
        <div className="forecast-scroll mb-5 ms-5 me-5" style={{ marginTop: '100px' }}>
          <div className="forecast">
            {forecast.map((day, index) => (
              <div key={index} className="forecast-day">
                <p>{new Date(day.date).toLocaleDateString(undefined, { weekday: 'short' })}</p>
                <img
                  src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                  alt={day.description}
                />
                <p>{Math.round(day.temp)}°C</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeatherWidget;