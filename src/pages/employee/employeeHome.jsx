import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { Link, useMatch, useResolvedPath, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '../../styles/employeeHome.css';

const EmployeeHome = () => {
    // CustomLink function to highlight active links
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
  
    return (
      <div className="container">
        {/* Navigation bar */}
        <nav className="nav">
          <Link to="/employee-home" className="homePage">Employee Dashboard</Link>
          <ul>
            <CustomLink to="/manage-packages">Manage Packages</CustomLink>
            <CustomLink to="/manage-supplies">Supplies</CustomLink>
            <CustomLink to="/incoming-packages">Incoming Packages</CustomLink>
            <CustomLink to="/employee-profile">Profile</CustomLink>
            <CustomLink to="/logout">Logout</CustomLink>
          </ul>
        </nav>
  
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
  
          {/* Dashboard Links Section */}
          <div className="dashboard-links" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '10px',
            marginTop: '30px',
            width: '100%',
            maxWidth: '600px'
          }}>
            <Link to="/incoming-packages" className="dashboard-tile">Incoming Packages</Link>
            <Link to="/manage-employee" className="dashboard-tile">Manage Employees</Link>
            <Link to="/manage-location" className="dashboard-tile">Manage Locations</Link>
            <Link to="/manage-packages" className="dashboard-tile">Manage Packages</Link>
            <Link to="/employee-supplies" className="dashboard-tile">Manage Supplies</Link>
            <Link to="/manage-truck" className="dashboard-tile">Manage Trucks</Link>
          </div>
        </div>
  
        {/* Footer */}
        <footer className="footer">
          <p>&copy; 2024 United Mail Services - Employee Dashboard. All rights reserved.</p>
        </footer>
      </div>
    );
  };
  
  export default EmployeeHome;

