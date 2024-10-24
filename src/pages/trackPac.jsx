import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from 'react-router-dom';

const TrackPackage = () => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [error, setError] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [trackingResult, setTrackingResult] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate tracking number
    if (!trackingNumber) {
      setError("Please enter a tracking number.");
      return;
    }

    if (trackingNumber.length < 10) {
      setError("Tracking number must be at least 10 characters long.");
      return;
    }

    // Simulate tracking API request (for now, mock result)
    setError("");
    setIsTracking(true);

    // Simulate an API call with a delay
    setTimeout(() => {
      setTrackingResult({
        status: "In Transit",
        location: "Houston, TX",
        expectedDelivery: "October 28, 2024"
      });
      setIsTracking(false);
    }, 2000);
  };

  return (
    <div className="track-package">
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
        <div className="tracking-result" style={{ marginTop: "20px", textAlign: "center" }}>
          <h2>Tracking Status</h2>
          <p>Status: {trackingResult.status}</p>
          <p>Current Location: {trackingResult.location}</p>
          <p>Expected Delivery: {trackingResult.expectedDelivery}</p>
        </div>
      )}
    </div>
  );
};

export default TrackPackage;
