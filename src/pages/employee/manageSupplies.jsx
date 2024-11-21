import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { Link, Routes, Route, useMatch, useResolvedPath } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ManagerNavbar, EmployeeNavbar } from "../../components/Navbars";
import "../../styles/managePackage.css";
import axios from "axios";
import ReactModal from "react-modal";

const manageSupplies = () => {
    const userID = localStorage.getItem('userID');
    const userRole = localStorage.getItem('userRole');
    const [OID, setInfo] = useState('');
    const [supplies, setSupplies] = useState([]);
    const [filteredSupplies, setFilteredSupplies] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [newSupply, setNewSupply] = useState({
      name: '',
      price: '',
      quantity: '',
      OID: OID,
      userID: userID
    });

    useEffect(() => {
    
      const getInfo = async () => {
        if (!userID || (userRole != 'employee' && userRole != 'manager')) {
          alert('User not logged in');
          navigate('/');
        }

        try {
    
          const infoResponse = await axios.post('https://post-backend-2f54f7162fc4.herokuapp.com/employee/get-location', { userID });
          if (infoResponse.data && infoResponse.data.length > 0) {
            setInfo(infoResponse.data[0].OID);
          } else {
            setInfo('No location assigned');
          }

          const suppliesResponse = await axios.post('https://post-backend-2f54f7162fc4.herokuapp.com/manager/get-supplies')
          setSupplies(suppliesResponse.data);

        } catch (error) {
          console.error('Error getting information:', error);
          alert('Failed to get information.');
        }
      };

      getInfo();
    }, [success]);

    useEffect(() => {
      if (OID) {
        setNewSupply((prevState) => ({
          ...prevState,
          OID: OID,
        }));
      }
    }, [OID]);
    

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setNewSupply({
        ...newSupply,
        [name]: value,
      });
    };

    const handleAddSupply = async (e) => {
      e.preventDefault();
  
  
      try {
        const response = await axios.post('https://post-backend-2f54f7162fc4.herokuapp.com/manager/add-supplies', newSupply);
        setSuccess('Supply added successfully.');
        setShowModal(false);
      } catch (err) {
        alert('Failed to add supply. Please try again.');
      }
    };
  
    const handleSearch = (e) => {
      const query = e.target.value;
      setSearch(query);

      const filteredSupplies = supplies.filter((sup) =>
          sup.name.toString().includes(query)
        );
      
      setFilteredSupplies(filteredSupplies);
    };
  
    const handleRestock = async (id, quantity) => {
      const updatedQuantity = quantity + 50;

      try{
        const response = await axios.post('https://post-backend-2f54f7162fc4.herokuapp.com/manager/restock-supplies', {updatedQuantity, userID, id});

        setSuccess('Supply restocked successfully!');

      } catch (error){
        console.error('Error restocking supply:', error);
    alert('Failed to restock supply. Please try again.');
      }
    };


    const handleDelete = async (id) => {

      const confirmDelete = window.confirm("Are you sure you want to update this supply?");

      if (!confirmDelete) {
        return; 
      }

      setSuccess(""); 
      setLoading(true);

      try{
        const response = await axios.post('https://post-backend-2f54f7162fc4.herokuapp.com/manager/delete-supplies', { id, userID });

        setSuccess('Supply updated.');

      } catch (err) {

        setError('Failed to update supply. Please try again.');
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className="container">
        {/* Navigation bar */}
        {userRole === 'employee' && <EmployeeNavbar />}
        {userRole === 'manager' && <ManagerNavbar />}
  
        {/* Main content area */}
        <div className="manage-content">
          <h1>Manage Supplies</h1>
          <p>Monitor and restock supplies at your location.</p>

          {userRole === 'manager' && (
            <button onClick={() => setShowModal(true)} className="create-button">
              Add New Supply
            </button>
          )}
  
          {/* Search bar */}
          <input
            type="text"
            placeholder="Search supplies..."
            value={search}
            onChange={handleSearch}
            className="search-input"
          />

          {success && <p className="success-message">{success}</p>}
          {error && <p className="error-message">{error}</p>}
  
          {/* Supplies Table */}
          <table className="packages-table">
            <thead>
              <tr>
                <th>Supply Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Office</th>
                <th>Actions</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {supplies
                .filter((supply) => 
                  supply.name.toLowerCase().includes(search.toLowerCase()) &&
                  (userRole === 'manager' || !supply.isDeleted)
                )
                .map((supply) => (
                  <tr key={supply.supplyID}>
                    <td>{supply.name}</td>
                    <td>{supply.quantity}</td>
                    <td>${supply.pricePerUnit}</td>
                    <td>{supply.city}</td>
                    <td>
                      {supply.OID === OID && (
                        <button
                          onClick={() => handleRestock(supply.supplyID, supply.quantity)}
                          className="info-button"
                        >
                          Restock
                        </button>
                      )}
                    </td>
                    <td>
                      {userRole === 'manager' && supply.OID === OID && (
                        <button
                          onClick={() => handleDelete(supply.supplyID)}
                          className="delete-button"
                        >
                          {supply.isDeleted ? "Reactivate" : "Delete"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>


          <ReactModal
              isOpen={showModal}
              onRequestClose={() => setIsModalOpen(false)}
              contentLabel="Add New Supply"
              className="custom-modal"
              overlayClassName="custom-overlay"
            >
              <h2>Add New Supply</h2>
              <form onSubmit={handleAddSupply}>
                <div>
                  <label>Supply Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={newSupply.name}
                    onChange={handleInputChange}
                    placeholder="Enter supply name"
                  />
                </div>
                <div>
                  <label>Price:</label>
                  <input
                    type="number"
                    name="price"
                    value={newSupply.price}
                    onChange={handleInputChange}
                    placeholder="Enter price"
                  />
                </div>
                <div>
                  <label>Quantity:</label>
                  <input
                    type="number"
                    name="quantity"
                    value={newSupply.quantity}
                    onChange={handleInputChange}
                    placeholder="Enter quantity"
                  />
                </div>
                <div>
                  <button type="submit" className="submit-button">
                    Add Supply
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="cancel-button"
                  >
                    Cancel
                  </button>
                </div>
              </form>
          </ReactModal>
  
      </div>
    );
  };
  
  export default manageSupplies;