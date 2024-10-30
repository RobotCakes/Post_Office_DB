import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { Link, Routes, Route, useMatch, useResolvedPath } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TrackPackage from './trackPackage';
import Register from './Signup';
import Login from './Login';
import '../styles/Home.css';

const Home = () => {
  function CustomLink({ to, children, ...props }) {
    const resolvedPath = useResolvedPath(to);
    const isActive = useMatch({ path: resolvedPath.pathname, end: true });
    return (
      <li className={isActive ? "active" : ""}>
        <Link to={to} {...props}>
          {children}
        </Link>
      </li>
    );
  }

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("Search submitted:", searchQuery);
  };

  return (
    <div className="container">
      <nav className="nav">
        <Link to="/home" className="homePage">Texas Mail Services</Link>
        <ul>
          <CustomLink to="/home">Home</CustomLink>
          <CustomLink to="/track-package">Track Package</CustomLink>
          <CustomLink to="/signup">Sign Up</CustomLink>
          <CustomLink to="/login">Login</CustomLink>
        </ul>
      </nav>

      <Routes>
        <Route path="/home" element={
          <div className="home-content">
            <div className="content-wrapper">
              <h1>Welcome to Texas Mail Services</h1>
              <p>Track your packages, register for an account, or log in to access more features.</p>
            
              <form onSubmit={handleSearchSubmit} className="search-form">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search our services..."
                  className="search-input"
                />
                <button type="submit" className="btn">Search</button>
              </form>

              <div className="services-section">
                <h2>Our Services</h2>
                <ul>
                  <li>Track Packages</li>
                  <li>Send and Receive Parcels</li>
                  <li>Find Post Office Locations</li>
                  <li>Shipping Rates Calculator</li>
                </ul>
                <Link to="/signup" className="btn">
                  Get Started with a New Account
                </Link>
              </div>
            </div>
          </div>
        } />
        
        <Route path="/track-package" element={<TrackPackage />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>

      <footer>
        <div className="content-wrapper">
          <p>&copy; 2024 Texas Mail Services. All rights reserved.</p>
          <ul>
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link to="/terms-of-service">Terms of Service</Link></li>
          </ul>
        </div>
      </footer>
    </div>
  );
};

export default Home;