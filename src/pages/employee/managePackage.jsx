import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { Link, Routes, Route, useMatch, useResolvedPath, useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { EmployeeNavbar } from "../../components/Navbars";
import "../../styles/managePackage.css";
import axios from 'axios';
import ReactModal from "react-modal";

const managePackage = () => {
      const [packages, setPackages] = useState([]);
      const navigate = useNavigate();
      const userID = localStorage.getItem('userID');
      const userRole = localStorage.getItem('userRole');
      const [modalData, setModalData] = useState(null);
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState("");
      const [trackingNumber, setTrackingNumber] = useState('');
      const [searchPackage, setSearchPackage] = useState("");
      const [filterPackage, setFilterPackage] = useState([]);
      const [success, setSuccess] = useState('');
      const [isEditOpen, setIsEditOpen] = useState(false);

      useEffect(() => {
        
        const getStatus = async () => {
          if (!userID || userRole != 'employee') {
            alert('User not logged in');
            navigate('/');
          }

          try {
            const response = await axios.post('http://localhost:3000/employee/get-at-office', { 
              userID: userID
            });
            
            setPackages(response.data); 

          } catch (error) {
            console.error('Error fetching packages:', error);
            alert('Failed to get package status');
          }
        };

        getStatus();
      }, [success]);



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
          setError('Failed to fetch package. Please try again.');
        } finally {
          setLoading(false);
        }
      };

    const handleSearch = (e) => {
      const query = e.target.value;
      setSearchPackage(query);

      const filtered = packages.filter((pkg) =>
          pkg.trackingNumber.toString().includes(query)
        );
      
      setFilterPackage(filtered);
    };



    const handleSubmit = async (trackingNumber, PID) => {
      setSuccess("");

      try{

        const response = await axios.post('http://localhost:3000/employee/package-edit', { 
              trackingNumber: trackingNumber,
              userID, userRole, PID
          });

        setSuccess('Package status updated.');

      } catch (err) {

        setError('Failed to update package. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    const handleDelete = async (PID) => {
      setSuccess("");

      try{

        const response = await axios.post('http://localhost:3000/employee/package-delete', { 
              trackingNumber: trackingNumber,
              userID, userRole, PID
          });

        setSuccess('Package deleted.');

      } catch (err) {

        setError('Failed to update package. Please try again.');
      } finally {
        setLoading(false);
      }
    };


    return (
      <div className="container">
        <EmployeeNavbar />

        <div className="manage-content">
          <h1>Manage Packages</h1>
          <p>Create, view, and modify packages at the post office.</p>

          <input
            type="text"
            placeholder="Search by Tracking Number"
            value={searchPackage}
            onChange={handleSearch}
            className="search-bar"
          />

          {success && <p className="success-message">{success}</p>}
          {error && <p className="error-message">{error}</p>}

          <table className="packages-table">
            <thead>
              <tr>
                <th>Tracking Number</th>
                <th>Package ID</th>
                <th>Status</th>
                <th>Time of Status</th>
                <th>Priority</th>
                <th>Information</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(filterPackage.length > 0 ? filterPackage : packages).map((pkg) => {
                  const reformatDate = new Date(pkg.timeOfStatus).toLocaleString();
                  
                  return (
                    <tr key={pkg.id}>
                      <td>{pkg.trackingNumber}</td>
                      <td>{pkg.PID}</td>
                      <td>{pkg.status}</td>
                      <td>{reformatDate}</td>
                      <td>{pkg.deliveryPriority}</td>
                      <td>
                        <button className="info-button" onClick={() => handleOpenModal(pkg.trackingNumber)}>
                          View
                        </button>
                      </td>
                      <td>
                        <button className="info-button" onClick={() => setIsEditOpen(true)}>
                          Edit
                        </button>
                        <button className="delete-button" onClick={() => handleDelete(pkg.PID)}>
                          Delete
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
          {error && <div className="error-message">{error}</div>}
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
                {modalData[0].fragile ? "Fragile, " : ""}{modalData[0].delivery ?  "Pick-up At Post Office": "Delivery"}<br />
                {modalData[0].type} Delivery <br />
                <strong>Special Instructions: </strong>{modalData[0].specialInstructions || "None"}
              </p>

            </div>
          )}
          <button onClick={() => setIsModalOpen(false)}>Close</button>
        </ReactModal>



        <ReactModal
          isOpen={isEditOpen}
          onRequestClose={() => setIsEditOpen(false)}
          contentLabel="Edit Package"
          className="custom-modal"
          overlayClassName="custom-overlay"
        >
          {loading && <p>Loading...</p>}
          {error && <div className="error-message">{error}</div>}
          {modalData && (
            <div>
              

            </div>
          )}
          <button onClick={() => setIsEditOpen(false)}>Close</button>
        </ReactModal>

        
      </div>
    );
  };
  
  export default managePackage;