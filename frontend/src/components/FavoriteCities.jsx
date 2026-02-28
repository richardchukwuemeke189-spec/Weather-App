import { useEffect, useState } from 'react';
import { getFavorites } from '../utils/favoritesService';
import { useNavigate, Link } from 'react-router-dom';
import '../style/favoriteCities.css'
import FooterComponents from './FooterComponents';
import CityCarousel from './CityCarousel';
import { removeFavorite as removeFavoriteAPI } from '../utils/favoritesService';

function FavoriteCities() {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();
  const [weatherData, setWeatherData] = useState({});

  const getWeatherTheme = (description = '') => {
    const desc = description.toLowerCase();
    if (desc.includes('sun')) return 'sunny';
    if (desc.includes('cloud')) return 'cloudy';
    if (desc.includes('rain')) return 'rainy';
    if (desc.includes('snow')) return 'snowy';
    if (desc.includes('storm') || desc.includes('thunder')) return 'stormy';
    return 'default-weather';
  };


const removeFavorite = async (cityToRemove) => {
  try {
    // Call backend to remove the city
    await removeFavoriteAPI(cityToRemove);

    // Update local favorites list
    const updatedFavorites = favorites.filter((city) => city !== cityToRemove);
    setFavorites(updatedFavorites);

    // Remove weather data for that city
    const updatedWeatherData = { ...weatherData };
    delete updatedWeatherData[cityToRemove];
    setWeatherData(updatedWeatherData);
  } catch (error) {
    console.error(`Failed to remove ${cityToRemove} from favorites:`, error);
  }
};

  useEffect(() => {
  const fetchWeatherForFavorites = async () => {
    const results = {};

    for (const city of favorites) {
      try {
        // const res = await fetch(`${import.meta.env.VITE_FAVORITES_URL}?city=${encodeURIComponent(city)}`);
        const res = await fetch(`https://weather-backend-001h.onrender.com/api/favorites?city=${encodeURIComponent(city)}`);
        const data = await res.json();
        results[city] = {
          temp: data.temperature,
          desc: data.description
        };
      } catch (err) {
        console.error(`Failed to fetch weather for ${city}:`, err);
      }
    }

    setWeatherData(results);
  };

  fetchWeatherForFavorites();
}, [favorites]);

  useEffect(() => {
    getFavorites()
      .then(setFavorites)
      .catch((err) => console.error('Failed to load favorites:', err));
  }, []);

  return (
    <div className='favoriteCitiesContainer'>
      <CityCarousel  />
      <div className="favorite-cities-list">
        {favorites.length === 0 ? (
          <div className="empty-message">
            <p>You haven’t added any favorite cities yet.</p>
            <p>Start exploring and save your favorite locations!</p>
            <p className='exploreLinkTxt'>
              <Link to='/exploreCities' className='explore-message'>Explore Cities</Link>
            </p>
          </div>
        ) : (
          favorites.map((city) => {
            const weather = weatherData[city] || {};

            return (
              <div key={city} className={`favorite-city-card ${getWeatherTheme(weather.desc)}`}>
                <Link to={`/weather/${encodeURIComponent(city)}`} onClick={() => setSelectedCity(city)}>
                  <h4>{city}</h4>
                  <div className="temp">
                    {weather.temp ? `${weather.temp}°C` : 'Loading...'}
                  </div>
                  <div className="desc">
                    {weather.desc || ''}
                  </div>
                </Link>
                <button
                  className="favorite-btn remove-btn"
                  onClick={(e) => {
                    e.preventDefault(); // prevent Link navigation
                    removeFavorite(city);
                  }}
                >
                  Remove
                </button>
              </div>
            );
          })
        )}
      </div>
    <FooterComponents />
  </div>
);
}

export default FavoriteCities;