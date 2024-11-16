import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { Link, Routes, Route, useMatch, useResolvedPath } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const IncomingPackages = () => {
    // State for incoming packages data
    const [packages, setPackages] = useState([
      { id: 1, trackingNumber: "123ABC", sender: "John Doe", status: "Arrived", arrivalDate: "2024-11-01" },
      { id: 2, trackingNumber: "456DEF", sender: "Jane Smith", status: "In Transit", arrivalDate: "2024-11-02" },
      { id: 3, trackingNumber: "789GHI", sender: "Bob Lee", status: "Pending", arrivalDate: "2024-11-03" },
    ]);
  
    const [searchQuery, setSearchQuery] = useState("");
  
    const handleSearchChange = (e) => setSearchQuery(e.target.value);
  
    const handleStatusUpdate = (id, newStatus) => {
      setPackages((prevPackages) =>
        prevPackages.map((pkg) =>
          pkg.id === id ? { ...pkg, status: newStatus } : pkg
        )
      );
    };
  
    return (
      <div className="container">
        {/* Navigation bar */}
        <nav className="nav">
          <Link to="/employee-home" className="homePage">Employee Dashboard</Link>
          <ul>
            <li><Link to="/employee-home">Dashboard</Link></li>
            <li><Link to="/manage-packages">Manage Packages</Link></li>
            <li><Link to="/manage-supplies">Manage Supplies</Link></li>
            <li><Link to="/incoming-packages" className="active">Incoming Packages</Link></li>
            <li><Link to="/employee-profile">Profile</Link></li>
            <li><Link to="/logout">Logout</Link></li>
          </ul>
        </nav>
  
        {/* Main content area */}
        <div className="manage-content">
          <h1>Incoming Packages</h1>
          <p>View and update the status of incoming packages below.</p>
  
          {/* Search bar */}
          <input
            type="text"
            placeholder="Search by tracking number or sender..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
  
          {/* Packages Table */}
          <table className="packages-table">
            <thead>
              <tr>
                <th>Tracking Number</th>
                <th>Sender</th>
                <th>Status</th>
                <th>Arrival Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {packages
                .filter((pkg) =>
                  pkg.trackingNumber.includes(searchQuery) || pkg.sender.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((pkg) => (
                  <tr key={pkg.id}>
                    <td>{pkg.trackingNumber}</td>
                    <td>{pkg.sender}</td>
                    <td>{pkg.status}</td>
                    <td>{pkg.arrivalDate}</td>
                    <td>
                      <button
                        onClick={() => handleStatusUpdate(pkg.id, "Delivered")}
                        className="action-link update-btn"
                      >
                        Mark as Delivered
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
  
        {/* Footer */}
        <footer className="footer">
          <p>&copy; 2024 United Mail Services - Incoming Packages. All rights reserved.</p>
        </footer>
      </div>
    );
  };
  
  export default IncomingPackages;