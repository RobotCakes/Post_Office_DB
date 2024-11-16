import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { Link, Routes, Route, useMatch, useResolvedPath } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const managePackage = () => {

    const userID = localStorage.getItem('userID');
    const userRole = localStorage.getItem('userRole');

    useEffect(() => {
    
      const getInfo = async () => {
          if (!userID || userRole != 'employee') {
              alert('User not logged in');
              navigate('/');
          }
      };

      getInfo();
    }, []);

    // State for managing packages data
    const [packages, setPackages] = useState([
      { id: 1, trackingNumber: "123ABC", status: "In Transit", destination: "New York, NY" },
      { id: 2, trackingNumber: "456DEF", status: "Delivered", destination: "San Francisco, CA" },
      { id: 3, trackingNumber: "789GHI", status: "Pending", destination: "Chicago, IL" },
    ]);
  
    // Placeholder for search and filter functionality
    const [searchQuery, setSearchQuery] = useState("");
  
    const handleSearchChange = (e) => setSearchQuery(e.target.value);
  
    return (
      <div className="container">
        {/* Navigation bar */}
        <nav className="nav">
          <Link to="/manage-packages" className="homePage">Employee Dashboard</Link>
          <ul>
            <li><Link to="/employee-home">Dashboard</Link></li>
            <li><Link to="/manage-packages" className="active">Manage Packages</Link></li>
            <li><Link to="/manage-supplies">Manage Supplies</Link></li>
            <li><Link to="/incoming-packages">Incoming Packages</Link></li>
            <li><Link to="/employee-profile">Profile</Link></li>
            <li><Link to="/logout">Logout</Link></li>
          </ul>
        </nav>
  
        {/* Main content area */}
        <div className="manage-content">
          <h1>Manage Packages</h1>
          <p>View and update package details below.</p>
  
          {/* Search bar */}
          <input
            type="text"
            placeholder="Search by tracking number..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
  
          {/* Packages Table */}
          <table className="packages-table">
            <thead>
              <tr>
                <th>Tracking Number</th>
                <th>Status</th>
                <th>Destination</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {packages
                .filter((pkg) => pkg.trackingNumber.includes(searchQuery))
                .map((pkg) => (
                  <tr key={pkg.id}>
                    <td>{pkg.trackingNumber}</td>
                    <td>{pkg.status}</td>
                    <td>{pkg.destination}</td>
                    <td>
                      <Link to={`/view-package/${pkg.id}`} className="action-link">View</Link> |
                      <Link to={`/edit-package/${pkg.id}`} className="action-link">Edit</Link> |
                      <button className="action-link delete-btn">Delete</button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
  
        {/* Footer */}
        <footer className="footer">
          <p>&copy; 2024 Texas Mail Services - Manage Packages. All rights reserved.</p>
        </footer>
      </div>
    );
  };
  
  export default managePackage;