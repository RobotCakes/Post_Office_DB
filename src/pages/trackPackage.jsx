import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faInfoCircle, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GuestNavbar } from "../components/Navbars";
import '../styles/home.css';

const TrackPackage = () => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [error, setError] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [trackingResult, setTrackingResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate tracking number
    if (!trackingNumber) {
      setError("Please enter a tracking number.");
      return;
    }

    if (trackingNumber.length < 7) {
      setError("Tracking number must be at least 7 characters long.");
      return;
    }

    // Simulate tracking API request (for now, mock result)
    setError("");
    setIsTracking(true);

    try {
      const response = await axios.post(`http://localhost:3000/guest/track`, {
        trackingNumber: trackingNumber
      });
      const location = `${response.data.city}, ${response.data.state}`;
      const reformatDate = new Date(response.data.timeOfStatus).toLocaleString();
      const reformatExpected = new Date(response.data.expectedDelivery).toLocaleString();

      setTrackingResult({
          status: response.data.status,
          location: location,
          timeOfStatus: reformatDate,
          expectedDelivery: reformatExpected
      });

    } catch (error) {
        if (error.response && error.response.status === 404) {
            setError("Tracking number not found.");
        } else {
            setError("Error fetching tracking information. Please try again later.");
        }
    } finally {
        setIsTracking(false);
    }
    };

  return (
    <div className="container">
      <GuestNavbar />
      <div className="home-content">
        <h1>Track Your Package</h1>
        <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "0 auto" }}>
          <label htmlFor="trackingNumber">Enter Tracking Number:</label>
          <input
            type="text"
            id="trackingNumber"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="e.g. 1234567890"
            style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
          {error && (
            <p style={{ color: "red", fontSize: "14px" }}>
              <FontAwesomeIcon icon={faTimes} /> {error}
            </p>
          )}
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", padding: "10px", borderRadius: "5px", backgroundColor: "#007bff", color: "#fff" }}
          >
            {isTracking ? "Tracking..." : "Track Package"}
          </button>
        </form>

        {/* Display tracking result */}
        {trackingResult && (
          <div className="tracking-box">
            <h2>Tracking Status</h2>
            <p>Status: {trackingResult.status}</p>
            <FontAwesomeIcon icon={faMapMarkerAlt} className="location-marker"/> <span className="highlight-location">Current Location: {trackingResult.location}</span>
            <p>Time of Status: {trackingResult.timeOfStatus}</p>
            <p>Expected Delivery: {trackingResult.expectedDelivery}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackPackage;
