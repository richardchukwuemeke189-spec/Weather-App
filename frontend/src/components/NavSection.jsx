// import { useEffect, useState } from 'react';
// import '../style/navSection.css';
// import Search from './Search';
// import { useAuth } from '../context/AuthContext';

// function NavSection({ onSearch }) {
//   const { user } = useAuth();

//   const [weather, setWeather] = useState(null);
//   const [forecast, setForecast] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const fetchWeatherByCity = async (city) => {
//     try {
//       setLoading(true);

//       // Current weather
//       const weatherRes = await fetch(
//         // `${import.meta.env.VITE_WEATHER_URL}?city=${encodeURIComponent(city)}`
//         `https://weather-backend-001h.onrender.com/api/weather?city=${encodeURIComponent(city)}`
//       );
//       const weatherData = await weatherRes.json();
//       if (!weatherRes.ok) throw new Error(weatherData.error);
//       setWeather(weatherData);

//       // Forecast
//       const forecastRes = await fetch(
//         // `${import.meta.env.VITE_WEATHER_URL}/forecast?city=${encodeURIComponent(city)}`
//         `https://weather-backend-001h.onrender.com/api/weather/forecast?city=${encodeURIComponent(city)}`
//       );
//       const forecastData = await forecastRes.json();
//       if (!forecastRes.ok) throw new Error(forecastData.error);

//       const daily = forecastData.list.filter(item =>
//         item.dt_txt.includes('12:00:00')
//       );
//       setForecast(daily);

//       setError('');
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!user) {
//     return <p>Loading profile... Reload the page!</p>;
//   }

//   return (
//     <div className="navSectionWrap d-flex">
//       <div className="profilePhotoWrap">
//         <img
//           className="profilePhoto"
//           src={
//             user?.photo
//               // ? `${import.meta.env.VITE_UPLOADS_URL}/${user.photo}`
//               ? `https://weather-backend-001h.onrender.com/uploads/${user.photo}`
//               : 'https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small/profile-icon-design-free-vector.jpg'
//           }
//           alt="Profile"
//         />
//       </div>

//       <div className="nameWrap">
//         <span className="helloTxt">Hello,</span>
//         <br />
//         <span className="usernameTxt">{user?.username || 'Guest'}</span>
//       </div>

//       <div className="profilePhotoWrapTwo">
//         <img
//           className="profilePhoto"
//           src={
//             user?.photo
//               // ? `${import.meta.env.VITE_UPLOADS_URL}/${user.photo}`
//               ? `https://weather-backend-001h.onrender.com/uploads/${user.photo}`
//               : 'https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small/profile-icon-design-free-vector.jpg'
//           }
//           alt="Profile"
//         />
//       </div>

//       <div className="searchWrap">
//         <Search onSearch={onSearch} />
//       </div>
//     </div>
//   );
// }

// export default NavSection;

import { useState } from 'react';
import '../style/navSection.css';
import Search from './Search';
import { useAuth } from '../context/AuthContext';

function NavSection({ onSearch }) {
  const { user } = useAuth();

  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [cache, setCache] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ✅ Safe fallbacks (no blocking UI)
  const username = user?.username || 'Guest';

  const profilePhoto = user?.photo
    ? `https://weather-backend-001h.onrender.com/uploads/${user.photo}`
    : 'https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small/profile-icon-design-free-vector.jpg';

  const fetchWeatherByCity = async (city) => {
    try {
      // ✅ Use cache
      if (cache[city]) {
        setWeather(cache[city].weather);
        setForecast(cache[city].forecast);
        return;
      }

      setLoading(true);

      // ✅ Parallel requests (faster)
      const [weatherRes, forecastRes] = await Promise.all([
        fetch(
          `https://weather-backend-001h.onrender.com/api/weather?city=${encodeURIComponent(city)}`
        ),
        fetch(
          `https://weather-backend-001h.onrender.com/api/weather/forecast?city=${encodeURIComponent(city)}`
        )
      ]);

      const weatherData = await weatherRes.json();
      const forecastData = await forecastRes.json();

      if (!weatherRes.ok) throw new Error(weatherData.error);
      if (!forecastRes.ok) throw new Error(forecastData.error);

      const daily = forecastData.list.filter(item =>
        item.dt_txt.includes('12:00:00')
      );

      setWeather(weatherData);
      setForecast(daily);

      // ✅ Save to cache
      setCache(prev => ({
        ...prev,
        [city]: { weather: weatherData, forecast: daily }
      }));

      setError('');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to fetch weather');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="navSectionWrap d-flex">
      <div className="profilePhotoWrap">
        <img
          className="profilePhoto"
          src={profilePhoto}
          alt="Profile"
        />
      </div>

      <div className="nameWrap">
        <span className="helloTxt">Hello,</span>
        <br />
        <span className="usernameTxt">{username}</span>
      </div>

      <div className="profilePhotoWrapTwo">
        <img
          className="profilePhoto"
          src={profilePhoto}
          alt="Profile"
        />
      </div>

      <div className="searchWrap">
        <Search
          onSearch={(city) => {
            fetchWeatherByCity(city);
            onSearch(city);
          }}
        />
      </div>

      {loading && <p className="loadingText">Fetching weather...</p>}
      {/* {error && <p className="errorText">{error}</p>} */}
    </div>
  );
}

export default NavSection;