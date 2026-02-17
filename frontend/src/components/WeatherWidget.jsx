import { useEffect, useState } from 'react';
import '../style/weatherWidget.css';
import '../style/functionBtn.css'
import { useTheme } from '../context/ThemeContext';
import TimeZone from './TimeZone';
import clear from '../images/sunny.png'
import clouds from '../images/clouds.png'
import rain from '../images/rain.png'
import thunderstorm from '../images/thunderstorm.png'
import drizzle from '../images/drizzle.png'
import snow from '../images/snow.png'
import mist from '../images/mist.png'
import { getFavorites, addFavorite, removeFavorite } from '../utils/favoritesService';
import { useParams } from 'react-router-dom';

const weatherThemes = {
  Clear: { background: `linear-gradient(#00000012), url(${clear})`, icon: '☀️' },
  Clouds: { background: `url(${clouds})`, icon: '☁️' },
  Rain: { background: `url(${rain})`, icon: '🌧️' },
  Thunderstorm: { background: `url(${thunderstorm})`, icon: '⛈️' },
  Drizzle: { background: `url(${drizzle})`, icon: '🌦️' },
  Snow: { background: `url(${snow})`, icon: '❄️' },
  Mist: { background: `url(${mist})`, icon: '🌫️' }
};

function WeatherWidget({ city: cityProp }) {
  const { city: cityParam } = useParams(); 
  const city = cityProp || cityParam;
  const { updateTheme } = useTheme();
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);


  const [isFavorite, setIsFavorite] = useState(false); 

  useEffect(() => {
  const fetchWeather = async (lat, lon) => {
    try {
      setLoading(true);
      const weatherRes = await fetch(`${import.meta.env.VITE_WEATHER_URL}?lat=${lat}&lon=${lon}`);
      const weatherData = await weatherRes.json();
      if (!weatherRes.ok) throw new Error(weatherData.error);
      setWeather(weatherData);
      updateTheme(weatherData, weatherData.sunrise, weatherData.sunset);

      const forecastRes = await fetch(`${import.meta.env.VITE_WEATHER_URL}?lat=${lat}&lon=${lon}`);
      const forecastData = await forecastRes.json();
      if (!forecastRes.ok) throw new Error(forecastData.error);
      const daily = forecastData.list.filter(item => item.dt_txt.includes('12:00:00'));
      setForecast(daily);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (city) {
    // If city is provided, fetch by city
    const fetchByCity = async () => {
      try {
        setLoading(true);
        const weatherRes = await fetch(`${import.meta.env.VITE_WEATHER_URL}?city=${encodeURIComponent(city)}`);
        const weatherData = await weatherRes.json();
        if (!weatherRes.ok) throw new Error(weatherData.error);
        setWeather(weatherData);
        updateTheme(weatherData, weatherData.sunrise, weatherData.sunset);

        const forecastRes = await fetch(`${import.meta.env.VITE_WEATHER_URL}?city=${encodeURIComponent(city)}`);
        const forecastData = await forecastRes.json();
        if (!forecastRes.ok) throw new Error(forecastData.error);
        const daily = forecastData.list.filter(item => item.dt_txt.includes('12:00:00'));
        setForecast(daily);
        setError('');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchByCity();
  } else {
    // Otherwise, use geolocation
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeather(latitude, longitude);
      },
      (err) => {
        console.error('Geolocation error:', err);
        setError('Location access denied. Please allow location or enter a city.');
        setLoading(false);
      }
    );
  }
}, [city, updateTheme]);

// ===== favorites =====
useEffect(() => {
  if (!city) return;
  
  getFavorites()
  .then((favs) => {
    setIsFavorite(favs.includes(city));
  })
  .catch((err) => {
    console.error('Failed to fetch favorites:', err);
  });
}, [city]);

const toggleFavorite = async () => {
  console.log('Favorite button clicked:', city);
  
  try {
    if (isFavorite) {
      await removeFavorite(city);
      setIsFavorite(false);
    } else {
      await addFavorite(city);
      setIsFavorite(true);
    }
  } catch (err) {
    console.error('Failed to update favorite:', err);
    // Optional: show a toast or alert here
  }
};
// ======================

if (loading) {
  return (
    <div className="weather-widget-wrapper m-5">
      <div className="weather-main">
        <div className="weather-card skeleton-card">
          <div className="skeleton skeleton-icon"></div>
          <div className="skeleton skeleton-title"></div>
          <div className="skeleton skeleton-temp"></div>
          <div className="skeleton skeleton-desc"></div>
          <div className="skeleton skeleton-button"></div>
        </div>

        <div className="wind-card skeleton-card">
          <div className="skeleton skeleton-title"></div>
          <div className="skeleton skeleton-wind-value"></div>
          <div className="skeleton skeleton-wind-lines"></div>
        </div>
      </div>

      <div className="forecast-scroll m-5">
        <div className="forecast">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="forecast-day skeleton-forecast">
              <div className="skeleton skeleton-forecast-day"></div>
              <div className="skeleton skeleton-forecast-icon"></div>
              <div className="skeleton skeleton-forecast-temp"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
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

  // const theme = weatherThemes[weather.description.split(' ')[0]] || weatherThemes['Clear'];
  const mainCondition = weather.main || 'Clear'; // fallback if undefined
  const theme = weatherThemes[mainCondition] || weatherThemes['Clear'];

  // ===== favorites =====




  return (
    <div>
      {weather && <TimeZone weather={weather} />}
      <div className="weather-widget-wrapper m-5">
        <div className="weather-main">
          <div className="weather-card" 
          style={{ background: theme.background }}
          >
            <div className="weather-icon">{theme.icon}</div>
            <h3>{weather.city}</h3>
            <p className="weather-temp">{weather.temperature}°C</p>
            <p className="weather-desc">{weather.description}</p>
            <button onClick={toggleFavorite} className='favorite-btn' disabled={!city}>
              {isFavorite ? '★ Remove Favorite' : '☆ Save Favorite'}
            </button>

          </div>

          <div className="wind-card">
            <h3 className="wind-label">Wind Speed</h3>
            <div className="wind-speed-container mt-5">
              <p className="wind-value">
              {weather.windSpeed !== undefined
                ? `${weather.windSpeed} m/s`
                : 'N/A'}
              </p>
              
              <div className="wind-animation">
                <div className="stream line-1"></div>
                <div className="stream line-2"></div>
                <div className="stream line-3"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="forecast-scroll mb-5 ms-5 me-5" style={{marginTop:'100px'}}>
          <div className="forecast">
            {forecast.map((day, index) => (
              <div key={index} className="forecast-day">
                <p>
                  {new Date(day.dt_txt).toLocaleDateString(undefined, {
                    weekday: 'short'
                  })}
                </p>
                <img
                  src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                  alt={day.weather[0].description}
                />
                <p>{Math.round(day.main.temp)}°C</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeatherWidget;