import { useState, useEffect } from "react";
import { Link, useMatch, useResolvedPath, useNavigate } from "react-router-dom"
import { CustomerNavbar } from "../../components/Navbars";
import axios from 'axios';
import "../../styles/managePackage.css";
import ReactModal from "react-modal";

const PackageHistory = () => {
  const [packages, setPackages] = useState([]);
  const navigate = useNavigate();
  const userID = localStorage.getItem('userID');
  const userRole = localStorage.getItem('userRole');
  const [modalData, setModalData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    
    const getHistory = async () => {
      if (!userID) {
        alert('User not logged in');
        navigate('/');
      }

      try {
        const response = await axios.post('http://localhost:3000/user/package-history', { 
          userID: userID
        });
        setPackages(response.data); 
      } catch (error) {
        console.error('Error fetching packages:', error);
        alert('Failed to fetch packages');
      }
    };

    getHistory();
  }, []);

  const handleOpenModal = async (trackingNumber) => {
    setIsModalOpen(true);
    setLoading(true);
    setError("");
    setModalData(null);

    try {
      const response = await axios.post('http://localhost:3000/user/package-info', { 
        trackingNumber: trackingNumber,
        userID: userID
      });
      console.log(response.data);
      setModalData(response.data);
    } catch (err) {
      setError("Failed to fetch package details. Please try again.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="container">
      <CustomerNavbar />

      <div className="manage-content">
        <h1>Package History</h1>
        <p>View package history below.</p>
        

        {/* Packages Table */}
        <table className="packages-table">
          <thead>
            <tr>
              <th>Tracking Number</th>
              <th>Status</th>
              <th>Time of Status</th>
              <th>Information</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((pkg) => {
                const reformatDate = new Date(pkg.timeOfStatus).toLocaleString();
                return (
                  <tr key={pkg.id}>
                    <td>{pkg.trackingNumber}</td>
                    <td>{pkg.status}</td>
                    <td>{reformatDate}</td>
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
            <h3>Sender Address</h3>
            <p>{modalData[0].senderStreet}, {modalData[0].senderCity}, {modalData[0].senderState} {modalData[0].senderZip}</p>

            <h3>Receiver Address</h3>
            <p>{modalData[0].receiverStreet}, {modalData[0].receiverCity}, {modalData[0].receiverState} {modalData[0].receiverZip}</p>

            <h3>Content</h3>
            <p>{modalData[0].packageContent}</p>

          </div>
        )}
        <button onClick={() => setIsModalOpen(false)}>Close</button>
      </ReactModal>
      

    </div>
  );
};

export default PackageHistory;