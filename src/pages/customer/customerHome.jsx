import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { Link, useMatch, useResolvedPath } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '../../styles/home.css';
import { CustomerNavbar } from "../../components/Navbars";
const Home = () => {
    
    return (
      <div className="container">
        <CustomerNavbar />

        <footer>
          <div className="content-wrapper">
            <p>&copy; 2024 Texas Mail Services. All rights reserved.</p>
          </div>
        </footer>

      </div>
        
    );
};

export default Home;