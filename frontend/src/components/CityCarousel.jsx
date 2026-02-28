import { useState, useEffect } from 'react';
import Slider from 'react-slick';
import '../style/cityCarousel.css'

const cities = [
  {
    name: 'Europe',
    image: 'https://www.atlasandboots.com/wp-content/uploads/2025/06/London-is-Europes-best-city-autumn-leaves.jpg'
  },
  {
    name: 'Asia',
    image: 'https://media.timeout.com/images/106224430/image.webp'
  },
  {
    name: 'Nigeria',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmBMOcQmdD_hcX9L6eVQ4TWErW17DMxBDpdg&s'
  },
  {
    name: 'Los Angeles',
    image: 'https://www.travelcenter.uk/blog/wp-content/uploads/2018/12/Los-Angeles-City-Guide.jpg'
  },
  {
    name: 'Miami',
    image: 'https://www.thetimes.com/imageserver/image/%2Fmethode%2Fsundaytimes%2Fprod%2Fweb%2Fbin%2Fcde34998-0731-11ec-ab20-2ce30c912e38.jpg?crop=7251%2C4079%2C55%2C589&resize=1200'
  },
  {
    name: 'Netherlands',
    image: 'https://broganabroad.com/wp-content/uploads/2020/05/Alkmaar-Netherlands.jpg'
  },
];

const CityCarousel = () => {
    const [favorites, setFavorites] = useState(cities.map(city => city.name));

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 992, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  };

  const [weatherData, setWeatherData] = useState({});
  
    useEffect(() => {
  const fetchWeatherForCities = async () => {
    const results = {};

    for (const city of cities) {
      try {
        // const res = await fetch(`${import.meta.env.VITE_WEATHER_URL}?city=${encodeURIComponent(city.name)}`);
        const res = await fetch(`https://weather-backend-001h.onrender.com/api/weather?city=${encodeURIComponent(city.name)}`);
        const data = await res.json();
        results[city.name] = {
          temp: data.temperature,
          desc: data.description
        };
      } catch (err) {
        console.error(`Failed to fetch weather for ${city.name}:`, err);
      }
    }

    setWeatherData(results);
  };

  fetchWeatherForCities();
}, []);


  return (
    <div className="city-carousel-scroll m-5">
        <div className="city-carousel">
            {cities.map((city, index) => {
            const weather = weatherData[city.name] || {};
            return (
                <div key={index} className="city-card-scroll">
                <div
                    className="city-background"
                    style={{ backgroundImage: `url(${city.image})` }}
                >
                    <div className="city-overlay">
                    <h3>{city.name}</h3>
                    <p>{weather.temp || '--'} | {weather.desc || 'Loading...'}</p>
                    </div>
                </div>
                </div>
            );
            })}
        </div>
    </div>
  );
};

export default CityCarousel