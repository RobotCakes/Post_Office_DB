import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { Link, useMatch, useResolvedPath } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GuestNavbar } from "../components/Navbars";
import '../styles/home.css';

const Home = () => {

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
    
    
    </div>
  );
};

export default Home;