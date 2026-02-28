import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../style/exploreCities.css';
import NavSection from '../components/NavSection';
import defaultCardImg from '../images/defaultCardImg.png'
import FooterComponents from '../components/FooterComponents'

const cities = [
  'Lagos', 'London', 'New York', 'Tokyo', 'Paris', 'Cairo', 'Sydney', 'Rio de Janeiro',
  'Dubai', 'Monaco', 'Bangkok', 'Istanbul', 'Toronto', 'Mumbai', 'Barcelona', 'Cape Town',
  'San Francisco', 'Seoul', 'Buenos Aires', 'Reykjavík', 'Lisbon', 'Athens', 'Hanoi',
  'Nairobi', 'Singapore', 'Oceania', 'Netherlands'
];

const largeCards = ['Lagos', 'Tokyo', 'Rio de Janeiro', 'Cape Town', 'New York', 'Sydney', 'Oceania'];

const cityImages = {
  Lagos: 'https://cms.forbesafrica.com/wp-content/uploads/2021/12/Forbes-Lagos-State-Supplement-Cover-Image-scaled.jpg',
  London: 'https://res.cloudinary.com/aenetworks/image/upload/c_fill,ar_2,w_3840,h_1920,g_auto/dpr_auto/f_auto/q_auto:eco/v1/topic-london-gettyimages-760251843-feature?_a=BAVAZGID0',
  'New York': 'https://cdn.sanity.io/images/nxpteyfv/goguides/3891a75f142b6e94613f464c4f68a607559122df-1600x1066.jpg',
  Tokyo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWr75-zsVQbLp9vngESdOPlhUgyppBhiJLGA&s',
  Paris: 'https://www.grayline.com/wp-content/uploads/2025/04/shutterstock_2464630783-scaled.jpg',
  Cairo: 'https://www.egypttoursportal.com/images/2017/11/Cairo-City-Egypt-Tours-Portal-1-e1511901150793.jpg',
  Sydney: 'https://a.travel-assets.com/findyours-php/viewfinder/images/res70/474000/474916-Sydney-Opera-House.jpg',
  'Rio de Janeiro': 'https://www.mauriciotravels.com/wp-content/uploads/2023/10/rio.jpg',
  Dubai: 'https://wise.com/imaginary-v2/84d9eecf90e288495a4cdfcfc660fd39.jpg?width=1200',
  Monaco: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/Monte_Carlo_Port_Hercules_b.jpg',
  'Cape Town': 'https://www.andbeyond.com/wp-content/uploads/sites/5/cape-town-aerial-view-greenpoint-stadium.jpg',
  Bangkok: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1a8F9azOn2IOWRS3-5cPcJ6EjOocPsSh3lQ&s',
  Istanbul: 'https://www.tooistanbul.com/wp-content/uploads/2020/10/Screen-Shot-2020-10-15-at-16.19.22.png',
  Toronto: 'https://cdn.sanity.io/images/nxpteyfv/goguides/e08386c7fbc493a03b7a43c3c79e343eb97d3ae8-1600x1066.jpg',
  Mumbai: 'https://www.holidaymonk.com/wp-content/uploads/2022/04/Gateway-Of-India-MUMBAI.jpg',
  Barcelona: 'https://www.barcelonacard.org/wp-content/uploads/barcelona-card-homepage-1746806969.jpg',
  'San Francisco': 'https://drupal-prod.visitcalifornia.com/sites/default/files/styles/fluid_1920/public/2025-01/VC_San-Francisco-Bay-Area-Region_gty-1348089637-RF_1280x640.jpg.webp?itok=gnJSI8kT',
  Seoul: 'https://static.toiimg.com/thumb/111258523/Seoul-South-Korea.jpg?width=636&height=358&resize=4',
  'Buenos Aires': 'https://guias-viajar.com/wp-content/uploads/2021/04/Avenida-9-de-julio-Buenos-Aires-en-Argentina.jpg',
  Reykjavík: 'https://www.adventurouskate.com/wp-content/uploads/2022/06/Things-to-Do-in-Reykjavik-Iceland-scaled.jpg',
  Lisbon: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2c/50/c7/a6/caption.jpg?w=1200&h=700&s=1&cx=4096&cy=2732&chk=v1_590889ee7dd671bade3e',
  Athens: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/30/93/7e/05/caption.jpg?w=1200&h=-1&s=1&cx=1920&cy=1080&chk=v1_745027d847e18a7e6184',
  Hanoi: 'https://assets.dm.rccl.com/is/image/RoyalCaribbeanCruises/royal/data/ports/hanoi-halong-bay-vietnam/things-to-do/hanoi-halong-bay-vietman-floating-village.jpg?$472x300$',
  Nairobi: 'https://s3.amazonaws.com/cdn.micato.com/wp-content/uploads/2018/09/07224537/Nairobi_Skyline-1110x700.jpg',
  Singapore: 'https://a.travel-assets.com/findyours-php/viewfinder/images/res70/542000/542607-singapore.jpg',
  Oceania: 'https://d3hne3c382ip58.cloudfront.net/files/uploads/bookmundi/resized/cmsfeatured/best-cities-in-australia-sydney-1554104907-785X440.jpg',
  Netherlands: 'https://broganabroad.com/wp-content/uploads/2020/05/Alkmaar-Netherlands.jpg'
};

function ExploreCities() {
  const [weatherData, setWeatherData] = useState({});
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState('');
  const [customCity, setCustomCity] = useState(null);
  
  useEffect(() => {
    const fetchAll = async () => {
      const results = {};
      for (const city of cities) {
        try {
          // const res = await fetch(`${import.meta.env.VITE_WEATHER_URL}?city=${encodeURIComponent(city)}`);
          const res = await fetch(`https://weather-backend-001h.onrender.com/api/weather?city=${encodeURIComponent(city)}`);
          const data = await res.json();
          results[city] = data;
        } catch (err) {
          results[city] = { error: true };
        }
      }
      setWeatherData(results);
      setLoading(false);
    };
    
    fetchAll();
}, []);

  const handleSearch = async (searchInput) => {
    setCity(searchInput);
    const normalized = searchInput.toLowerCase();
    const isInList = cities.some((c) => c.toLowerCase() === normalized);
    
    if (!isInList) {
        try {
            setLoading(true);
            // const res = await fetch(`${import.meta.env.VITE_WEATHER_URL}?city=${encodeURIComponent(searchInput)}`);
            const res = await fetch(`https://weather-backend-001h.onrender.com/api/weather?city=${encodeURIComponent(searchInput)}`);
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setWeatherData((prev) => ({ ...prev, [searchInput]: data }));
            setCustomCity(searchInput);
        } catch (err) {
            setWeatherData((prev) => ({ ...prev, [searchInput]: { error: true } }));
            setCustomCity(searchInput);
        } finally {
            setLoading(false);
        }
    } else {
        setCustomCity(null);
    }
};

  const filteredCities = city
  ? cities.filter((c) => c.toLowerCase().includes(city.toLowerCase()))
  : cities;

  if (loading) {
    return (
      <div className="explore-grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="city-card skeletonExp">
            <div className="skeleton-title" />
            <div className="skeleton-line" />
            <div className="skeleton-line short" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div style={{ padding: '20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <NavSection onSearch={handleSearch} />
        </div>

        <div className="explore-grid">
          {(customCity ? [customCity] : filteredCities).map((city) => {
              const data = weatherData[city];
              const isLarge = largeCards.includes(city);
              const imageUrl = cityImages[city] || `https://source.unsplash.com/400x300/?${encodeURIComponent(city)},city`;
              const hasImage = Boolean(imageUrl);
              const isCustomCity = !cityImages[city];

            return (
              <Link
                  to={`/weather/${city}`}
                  key={city}
                  className={`city-card ${isLarge ? 'lg' : ''}`}

                  style={
                  !isCustomCity
                      ? {
                          backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.6), rgba(0,0,0,0.2)), url(${imageUrl})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                      }
                      : {
                          background:`linear-gradient(rgba(0, 0, 0, 0.13), rgba(0, 0, 0, 0.13)), url(${defaultCardImg})`
                      }
                  }

              >
                <h3>{city}</h3>
                {data && !data.error ? (
                  <>
                    <p>{data.temperature}°C</p>
                    <p>{data.description}</p>
                  </>
                ) : (
                  <p className="error">Weather unavailable</p>
                )}
              </Link>
            );
          })}
        </div>
      </div>
      <FooterComponents />
    </div>
  );
}

export default ExploreCities;