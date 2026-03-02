import { Link, useLocation } from "react-router-dom";
import '../style/navbar.css';
import logo from '../images/logo.png'

function Navbar() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="app-nav">
      {/* Logo (mobile only) */}
      <div className="nav-logo" style={{display:'flex'}}>
        <div className="logoImgWrap">
          <img src={logo} alt="LUME-weather" />
        </div>
      </div>

      {/* Site title (desktop only) */}
      <div className="site-title" style={{cursor:'pointer'}}>LUME Weather</div>

      <Link to="/" className="nav-item">
        <span className="linkTxt">Home</span>
        <span className="linkIcon">
          <i className={currentPath === '/' ? 'bi bi-house-fill' : 'bi bi-house'}></i>
        </span>
      </Link>

      <Link to="/exploreCities" className="nav-item">
        <span className="linkTxt">Explore</span>
        <span className="linkIcon">
          <i className={currentPath === '/exploreCities' ? 'bi bi-compass-fill' : 'bi bi-compass'}></i>
        </span>
      </Link>

      <div className="logoImgWrapTwo">
        <img src={logo} alt="LUME-weather" />
      </div>

      <Link to="/favoriteCities" className="nav-item searchLinkTxt">
        <span className="linkTxt">Favorites</span>
        <span className="linkIcon">
          <i className={currentPath === '/favoriteCities' ? 'bi bi-balloon-heart-fill' : 'bi bi-balloon-heart'}></i>
        </span>
      </Link>

      <Link to="/profile" className="nav-item">
        <span className="linkTxt">Profile</span>
        <span className="linkIcon">
          <i className={currentPath === '/profile' ? 'bi bi-person-fill' : 'bi bi-person'}></i>
        </span>
      </Link>
    </nav>
  );
}

export default Navbar;