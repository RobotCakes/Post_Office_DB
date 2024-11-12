import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { Link, useMatch, useResolvedPath, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { EmployeeNavbar } from "../../components/Navbars";
import '../../styles/employeeHome.css';

const EmployeeHome = () => {
    
  
    return (
      <div className="container">
        {/* Navigation bar */}
        <EmployeeNavbar />
  
        {/* Main content area */}
        <div className="home-content" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 200px)', // Adjust this value based on nav and footer height
          textAlign: 'center',
          padding: '50px'
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1>Employee Dashboard</h1>
            <p>Access package management, supplies, and other employee resources here.</p>
          </div>
  
          {/* Quick Stats Section */}
          <div className="quick-stats" style={{
            width: '100%',
            maxWidth: '600px',
            textAlign: 'center',
            marginTop: '20px'
          }}>
            <h2>Quick Stats</h2>
            <p>Incoming Packages Today: 12</p>
            <p>Low Supplies: Tape, Boxes</p>
          </div>
  
          
        </div>
          

        {/* Footer */}
        <footer className="footer">
          <p>&copy; 2024 Texas Mail Services - Employee Dashboard. All rights reserved.</p>
        </footer>
      </div>
    );
  };
  
  export default EmployeeHome;

