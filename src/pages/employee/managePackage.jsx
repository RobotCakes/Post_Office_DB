// ------------ASHLEY-------------------------------------------------
import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { Link, Routes, Route, useMatch, useResolvedPath, useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ManagerNavbar, EmployeeNavbar } from "../../components/Navbars";
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
      const [tn, setTrackingNumber] = useState('');
      const [pid, setPID] = useState('');
      const [searchPackage, setSearchPackage] = useState("");
      const [filterPackage, setFilterPackage] = useState([]);
      const [success, setSuccess] = useState('');
      const [isEditOpen, setIsEditOpen] = useState(false);
      const [deliveryPriorities, setDeliveryPriorities] = useState([]);
      const [offices, setOffices] = useState([]);
      const [selectedStatus, setSelectedStatus] = useState(null);
      const [selectedOffice, setSelectedOffice] = useState(1);
      const [info, setInfo] = useState('');
      const [isCreateOpen, setCreateOpen] = useState(false);

      useEffect(() => {
        
        const getStatus = async () => {
          if (!userID || (userRole != 'employee' && userRole != 'manager')) {
            alert('User not logged in');
            navigate('/');
          }

          try {
            const response = await axios.post('https://post-backend-2f54f7162fc4.herokuapp.com/employee/get-at-office', { 
              userID: userID
            });
            
            setPackages(response.data); 

            const prioResponse = await axios.post('https://post-backend-2f54f7162fc4.herokuapp.com/data/get-prio');
            setDeliveryPriorities(prioResponse.data);

            const officeResponse = await axios.post('https://post-backend-2f54f7162fc4.herokuapp.com/data/get-offices');
            setOffices(officeResponse.data);

            const infoResponse = await axios.post('https://post-backend-2f54f7162fc4.herokuapp.com/employee/get-location', { userID });
            if (infoResponse.data && infoResponse.data.length > 0) {
              setInfo(infoResponse.data[0].OID);
            } else {
              setInfo('No location assigned');
            }
            
          } catch (error) {
            console.error('Error fetching information:', error);
            alert('Failed to get information');
          }
        };

        getStatus();
      }, [success]);



      const handleOpenModal = async (trackingNumber, PID) => {
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
          setTrackingNumber(trackingNumber);
          setPID(PID);

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


    // You HAVE to open package info before you do this I can't figure out a way to pass the trackingNumber and PID :(
    const handleSubmit = async (e) => {
      e.preventDefault(); 
      
     
      if (!selectedStatus) {
        setError('Please provide valid tracking number and information.');
        setLoading(false);
        return;
      }
    
      try {
        setLoading(true);   
        setError("");     
        setSuccess("");


        const response = await axios.post('https://post-backend-2f54f7162fc4.herokuapp.com/employee/package-edit', { 
          trackingNumber: tn, userID, userRole, selectedStatus, selectedOffice, currOID: info, PID: pid
        });
    
        setSuccess('Package status updated.');
        setIsEditOpen(false); 
    
      } catch (err) {
        console.log(tn);
        console.log(pid);
        setError('Failed to update package. Please try again. Be sure to check package info.');
      } finally {
        setLoading(false);
      }
    };



    const handleDelete = async (trackingNumber, PID) => {
      const confirmDelete = window.confirm("Are you sure you want to delete this package?");

      if (!confirmDelete) {
        return; 
      }

      setSuccess(""); 
      setLoading(true);

      try{

        const response = await axios.post('https://post-backend-2f54f7162fc4.herokuapp.com/employee/package-delete', { 
              trackingNumber, userID, userRole, PID, currOID: info
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
        {userRole === 'employee' && <EmployeeNavbar />}
        {userRole === 'manager' && <ManagerNavbar />}

        <div className="manage-content">
          <h1>Manage Packages</h1>
          <p>Create, view, and modify packages at the post office.</p>
          <p>Make sure to check package information before making any changes.</p>

          <button className="create-button" onClick={() => navigate('/create-package')}>
            Create Package
          </button>

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
                        <button className="info-button" onClick={() => handleOpenModal(pkg.trackingNumber, pkg.PID)}>
                          View
                        </button>
                      </td>
                      <td>
                        <button className="info-button" onClick={() => setIsEditOpen(true)}>
                          Edit
                        </button>
                        <button className="delete-button" onClick={() => handleDelete(pkg.trackingNumber,pkg.PID)}>
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
              
              <div>
                <h2>Edit Package Status</h2>
                <form onSubmit={(e) => {
                  console.log("Form submit triggered");
                  e.preventDefault();
                  handleSubmit(e, tn, pid);
                }}>
                  <label htmlFor="status">Select Status:</label>
                  <select
                    id="status"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="">Select Status</option>
                    <option value="In transit">In transit</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>

                  {selectedStatus === "In transit" && (
                    <>
                      <label htmlFor="office">Select Post Office:</label>
                      <select
                        id="office"
                        value={selectedOffice}
                        onChange={(e) => setSelectedOffice(e.target.value)}
                      >
                        <option value="">Select Next Post Office</option>
                        {offices.map((office) => (
                          <option key={office.OID} value={office.OID}>
                             {office.city}
                          </option>
                        ))}
                      </select>
                    </>
                  )}

                  <button type="submit" disabled={loading}>
                    Save Changes
                  </button>
                  <button type="button" onClick={() => setIsEditOpen(false)}>
                    Close
                  </button>
                </form>
              </div>
            </ReactModal>

        
      </div>
    );
  };
  
  export default managePackage;