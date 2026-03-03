import '../style/navbar.css';
import '../style/search.css'

function Search({ onSearch }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const city = e.target.elements.city.value.trim();
    if (city) {
      onSearch(city);
      e.target.reset();

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className='searchForm'>
        <div>
          <input
            name="city"
            className="search searchInput form-control"
            type="search"
            placeholder="Enter city name"
          />
        </div>
        <div>
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </div>
      </form>
    </div>
  );
}

export default Search;