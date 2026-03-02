import { useParams, useNavigate } from 'react-router-dom';
import NavSection from '../components/NavSection';
import WeatherWidget from '../components/WeatherWidget';
import '../style/home.css';
import CityCarousel from '../components/CityCarousel';
import WeatherHighlights from '../components/WeatherHighlights';
import FooterComponents from '../components/FooterComponents';

function Home() {
  const { city } = useParams();
  const navigate = useNavigate();

  const handleSearch = (searchedCity) => {
    if (!searchedCity) return;

    const trimmed = searchedCity.trim();
    if (!trimmed) return;

    navigate(`/weather/${encodeURIComponent(trimmed)}`);
    console.log("Searching for:", searchedCity);
  };

  return (
    <div>
      <div className="homeWrap">
        <NavSection onSearch={handleSearch} />
        <WeatherWidget city={city} />
        <div className='mt-3 mobileNavSection'>
          <NavSection onSearch={handleSearch} />
        </div>
        <div className="exploreContainerHome">
          <h2 className="carousel-heading">🌍 Explore Popular Cities</h2>
          <p className="carousel-subtext" style={{ color: '#ffffffdc' }}>
            Swipe or scroll to explore the weather in trending cities
          </p>
          <CityCarousel />
        </div>

        <WeatherHighlights />
      </div>

      <div className="footerWrap">
        <FooterComponents />
      </div>
    </div>
  );
}

export default Home;