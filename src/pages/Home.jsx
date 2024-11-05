import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { Link, useMatch, useResolvedPath } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GuestNavbar } from "../components/Navbars";
import '../styles/home.css';

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
      <GuestNavbar />
      
      <div className="home-content">
        <div className="content-wrapper">
          <h1>Welcome to Texas Mail Services</h1>
          <p>Track your packages, register for an account, or log in to access more features.</p>
          
          {/*
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
            */}
          
          <div className="services-section">
            {/*
            <h2>Our Services</h2>
            <ul>
              <li>Track Packages</li>
              <li>Send and Receive Packages</li>
            </ul> */}
            <Link to="/signup" className="btn">
              Get Started with a New Account
            </Link>
          </div>

          <div className="services-section">
            <h2>Post Office Locations</h2>
            <ul>
              <li>5001 N Mesa St, El Paso, TX, 79912</li>
              <li>2001 Main St, Dallas, TX, 75201</li>
              <li>1302 Texas Ave, Houston, TX, 77002</li>
              <li>401 N Water St, Corpus Christi, TX, 78401</li>
            </ul>
          </div>
        </div>
      </div>
    
      

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