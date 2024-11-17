// ------------ASHLEY-------------------------------------------------
import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { Link, Routes, Route, useMatch, useResolvedPath, useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CustomerNavbar } from "../../components/Navbars";
import "../../styles/managePackage.css";
import axios from 'axios';
import ReactModal from "react-modal";

const packageStatus = () => {
    const [packages, setPackages] = useState([]);
    const navigate = useNavigate();
    const userID = localStorage.getItem('userID');
    const userRole = localStorage.getItem('userRole');
    const [modalData, setModalData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [role, setRole] = useState('');
    const [trackingNumber, setTrackingNumber] = useState('');


  useEffect(() => {
    
    const getStatus = async () => {
      if (!userID || userRole != 'customer') {
        alert('User not logged in');
        navigate('/');
      }

      try {
        const response = await axios.post('https://post-backend-2f54f7162fc4.herokuapp.com/user/package-status', { 
          userID: userID
        });
        
        setPackages(response.data); 
      } catch (error) {
        console.error('Error fetching packages:', error);
        alert('Failed to get package status');
      }
    };

    getStatus();
  }, []);

  const handleOpenModal = async (trackingNumber) => {
    setIsModalOpen(true);
    setLoading(true);
    setError("");
    setModalData(null);


    try{

      const response = await axios.post('https://post-backend-2f54f7162fc4.herokuapp.com/user/package-info', { 
            trackingNumber: trackingNumber
        });
      console.log(response.data);
      setModalData(response.data);

    } catch (err) {
      setError('Failed to check package. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const handleOpenAddPackageModal = () => {
    setIsAddOpen(true); 
  };

  const handleAddPackage = async (e) => {
      e.preventDefault();  
      setLoading(true);
      setError(""); 
      setModalData(null);
      
      if (!trackingNumber || !role) {
        setError('Please provide both tracking number and role.');
        setLoading(false);
        return;
      }

        try {
            const response = await axios.post('https://post-backend-2f54f7162fc4.herokuapp.com/user/add-package', { 
                trackingNumber: trackingNumber,
                role: role,
                userID: userID
            });

            if (response.data.success) {
                alert('Package added.');
                setIsAddOpen(false); 
                setTrackingNumber('');
                setRole('');
            }
        } catch (err) {
          if (err.response && err.response.data && err.response.data.message) {
              setError(err.response.data.message);  
          } else {
              setError("Failed to add package. Please try again.");
          }
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="container">
      <CustomerNavbar />

      <div className="manage-content">
        <h1>Package Status</h1>
        <p>View all live packages.</p>
        <p>Don't see your package?</p>
        <button onClick={handleOpenAddPackageModal} className="package-button">
          Add Package
        </button>

        <table className="packages-table">
          <thead>
            <tr>
              <th>Tracking Number</th>
              <th>Status</th>
              <th>Time of Status</th>
              <th>Current Location</th>
              <th>Next Location</th>
              <th>Information</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((pkg) => {
                const reformatDate = new Date(pkg.timeOfStatus).toLocaleString();
                const currentLocation = pkg.currentCity && pkg.currentState 
                  ? `${pkg.currentCity}, ${pkg.currentState}` 
                  : ''; // Avoids outputting null, null

                const nextLocation = pkg.nextCity && pkg.nextState 
                  ? `${pkg.nextCity}, ${pkg.nextState}` 
                  : '';

                return (
                  <tr key={pkg.id}>
                    <td>{pkg.trackingNumber}</td>
                    <td>{pkg.status}</td>
                    <td>{reformatDate}</td>
                    <td>{currentLocation}</td>
                    <td>{nextLocation}</td>
                    <td> {/* Gets information on content, sender and receiver addresses */}
                      <button className="info-button" onClick={() => handleOpenModal(pkg.trackingNumber)}>
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>


      {/* For package info */}        
      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Package Information"
        className="custom-modal"
        overlayClassName="custom-overlay"
      >
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {modalData && (
          <div>
            <h2>Package Information</h2>
            <h3>Sender</h3>
            <p>{modalData[0].senderLastName}, {modalData[0].senderFirstName} {modalData[0].senderMI} {modalData[0].senderStreet}, {modalData[0].senderCity}, {modalData[0].senderState} {modalData[0].senderZip}, {modalData[0].senderCountry}</p>

            <h3>Receiver</h3>
            <p>{modalData[0].receiverLastName}, {modalData[0].receiverFirstName} {modalData[0].receiverMI} {modalData[0].receiverStreet}, {modalData[0].receiverCity}, {modalData[0].receiverState} {modalData[0].receiverZip}, {modalData[0].receiverCountry}</p>

            <h3>Content</h3>
            <p>{modalData[0].packageContent}</p>

            <h3>Expected Delivery</h3>
            <p>{new Date(modalData[0].expectedDelivery).toLocaleString()}</p>

            <h3>Package Details</h3>
            <p>
              {modalData[0].fragile ? "Fragile, " : ""}{modalData[0].delivery ? "Pick-up At Post Office": "Delivery"}<br />
              {modalData[0].type} Delivery <br />
              <strong>Special Instructions: </strong>{modalData[0].specialInstructions || "None"}
            </p>

          </div>
        )}
        <button onClick={() => setIsModalOpen(false)}>Close</button>
      </ReactModal>


       {/* For "adding" packages */} 
       <ReactModal
        isOpen={isAddOpen}
        onRequestClose={() => setIsAddOpen(false)}
        contentLabel="Add Package"
        className="custom-modal"
        overlayClassName="custom-overlay"
      >
        <h2>Add Package to History</h2>
        
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleAddPackage}>
          <label>
            <input 
              type="text" 
              value={trackingNumber} 
              required 
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Enter tracking number"
              pattern="^\d{7,}$"
              title="Tracking number must be at least 7 digits"
            />
          </label>
          <br />
          <div className="role-selection">
            <label>
              <input
                type="radio"
                name="role"
                value="sender"
                required
                onChange={() => setRole('sender')}
              />
              Sender
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="receiver"
                required
                onChange={() => setRole('receiver')}
              />
              Receiver
            </label>
          </div>
          <br />
          <button type="submit">Add Package</button> 
          <button type="button" onClick={() => setIsAddOpen(false)}>Cancel</button>
        </form>
      </ReactModal>
      
    </div>
  );
};  
export default packageStatus;
// ------------ASHLEY (END)-------------------------------------------------