// import { useNavigate } from 'react-router-dom';
// import '../style/navSection.css';
// import Search from '../components/Search';

// function SearchPage() {
//   const navigate = useNavigate();

//   const handleSearch = (city) => {
//     // Navigate to the WeatherWidget route
//     navigate(`/weather/${encodeURIComponent(city)}`);
//   };

//   return (
//     <div className="navSectionWrap d-flex">
//       <div className="searchWrap">
//         <Search onSearch={handleSearch} />
//       </div>
//     </div>
//   );
// }

// export default SearchPage;

import { useNavigate } from 'react-router-dom';
import '../style/navSection.css';
import Search from '../components/Search';

function SearchPage() {
  const navigate = useNavigate();

  const handleSearch = (city) => {
    if (!city) return;

    const trimmedCity = city.trim();
    if (!trimmedCity) return;

    navigate(`/weather/${encodeURIComponent(trimmedCity)}`);
  };

  return (
    <div className="navSectionWrap d-flex">
      <div className="searchWrap">
        <Search onSearch={handleSearch} />
      </div>
    </div>
  );
}

export default SearchPage;