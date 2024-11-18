import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { Link, useMatch, useResolvedPath, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AdminNavbar } from "../../components/Navbars";
import '../../styles/adminHome.css';


const adminHome = () => {
  const userID = localStorage.getItem('userID');
  const userRole = localStorage.getItem('userRole');
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    const getInfo = async () => {
      if (!userID || userRole !== 'admin') {
        alert('You must be logged in as an admin');
        navigate('/');
      }
    };

    getInfo();
  }, [userID, userRole, navigate]); // Added dependencies to useEffect

  return (
    <div className="container">
      <AdminNavbar /> 

      <div className="home-content">
        <div className="content-wrapper">
          <h1>Welcome, Admin!</h1>
          <h3>UID: {userID}</h3>
          <p>Manage post office locations, oversee employee tasks, and manage package status updates!</p>

          <div className="admin-services-section">
            <h2>Admin Services</h2>
            
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
}

export default adminHome;
