import { useEffect, useState } from 'react';
import '../style/navSection.css';
import Search from './Search';
import { useAuth } from '../context/AuthContext';

const fetchWeatherByCity = async (city) => {
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


function NavSection({ onSearch }) {
  const{user} = useAuth();
  
  if(!user){
    return <p>Loading profile... Reload the page!</p>;
  }

  return (
    <div className="navSectionWrap d-flex">
      <div className="profilePhotoWrap">
        <img
          className="profilePhoto"
          src={
            user?.photo
              ? `${import.meta.env.VITE_UPLOADS_URL}/${user.photo}`
              : 'https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small/profile-icon-design-free-vector.jpg'
          }
          alt="Profile"
        />
      </div>

      <div className="nameWrap">
        <span className="helloTxt">Hello,</span>
        <br />
        <span className="usernameTxt">{user?.username || 'Guest'}</span>
      </div>

      <div className="profilePhotoWrapTwo">
        <img
          className="profilePhoto"
          src={
            user?.photo
              ? `${import.meta.env.VITE_UPLOADS_URL}/${user.photo}`
              : 'https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small/profile-icon-design-free-vector.jpg'
          }
          alt="Profile"
        />
      </div>

      <div className="searchWrap">
        <Search onSearch={onSearch} />
      </div>
    </div>
  );
}

export default NavSection;