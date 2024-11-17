// This should be admin only, managers can't edit post offices
import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { Link, Routes, Route, useMatch, useResolvedPath } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ManagerNavbar } from "../../components/Navbars";

const manageLocation = () => {
    // State for location data
    const [locations, setLocations] = useState([
      { id: 1, name: "Downtown Office", address: "123 Main St", status: "Open" },
      { id: 2, name: "Suburban Office", address: "456 Oak Rd", status: "Closed for Maintenance" },
      { id: 3, name: "East Side Office", address: "789 Pine Ln", status: "Open" },
    ]);
  
    const [searchQuery, setSearchQuery] = useState("");
    const [newLocation, setNewLocation] = useState({ name: "", address: "", status: "Open" });
  
    const handleSearchChange = (e) => setSearchQuery(e.target.value);
  
    const handleAddLocation = () => {
      if (newLocation.name && newLocation.address) {
        setLocations((prevLocations) => [
          ...prevLocations,
          { id: Date.now(), ...newLocation },
        ]);
        setNewLocation({ name: "", address: "", status: "Open" });
      }
    };
  
    return (
      <div className="container">
        {/* Navigation bar */}
        <ManagerNavbar />
  
        {/* Main content area */}
        <div className="manage-content">
          <h1>Manage Locations</h1>
          <p>Search, update, or add new post office locations below.</p>
  
          {/* Search bar */}
          <input
            type="text"
            placeholder="Search locations by name or address..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
  
          {/* Locations Table */}
          <table className="locations-table">
            <thead>
              <tr>
                <th>Location Name</th>
                <th>Address</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {locations
                .filter(
                  (loc) =>
                    loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    loc.address.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((loc) => (
                  <tr key={loc.id}>
                    <td>{loc.name}</td>
                    <td>{loc.address}</td>
                    <td>{loc.status}</td>
                  </tr>
                ))}
            </tbody>
          </table>
  
          {/* Add New Location */}
          <div className="add-location-form">
            <h2>Add New Location</h2>
            <input
              type="text"
              placeholder="Location Name"
              value={newLocation.name}
              onChange={(e) =>
                setNewLocation((prev) => ({ ...prev, name: e.target.value }))
              }
              className="input-field"
            />
            <input
              type="text"
              placeholder="Address"
              value={newLocation.address}
              onChange={(e) =>
                setNewLocation((prev) => ({ ...prev, address: e.target.value }))
              }
              className="input-field"
            />
            <select
              value={newLocation.status}
              onChange={(e) =>
                setNewLocation((prev) => ({ ...prev, status: e.target.value }))
              }
              className="select-field"
            >
              <option value="Open">Open</option>
              <option value="Closed for Maintenance">Closed for Maintenance</option>
            </select>
            <button onClick={handleAddLocation} className="add-location-button">
              Add Location
            </button>
          </div>
        </div>
  
        
      </div>
    );
  };
  
  export default manageLocation;