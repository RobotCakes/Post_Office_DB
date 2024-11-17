import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { Link, useMatch, useResolvedPath, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ManagerNavbar, EmployeeNavbar } from "../../components/Navbars";
import '../../styles/employeeProfile.css';

const employeeProfile = () => {
    const userID = localStorage.getItem('userID');
    const userRole = localStorage.getItem('userRole');

    const [employee, setEmployee] = useState({
      name: "John Doe",
      email: "johndoe@example.com",
      role: "Employee",
      location: "Downtown Office",
      phone: "123-456-7890",
    });
  
    const [editMode, setEditMode] = useState(false);
    const [updatedInfo, setUpdatedInfo] = useState({ ...employee });
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setUpdatedInfo((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleSave = () => {
      setEmployee(updatedInfo);
      setEditMode(false);
    };
  
    return (
      <div className="container">
        {/* Navigation bar */}
        {userRole === 'employee' && <EmployeeNavbar />}
        {userRole === 'manager' && <ManagerNavbar />}

        {/* Profile content */}
        <div className="profile-content">
          <h1>Employee Profile</h1>
  
          {!editMode ? (
            <div className="profile-info">
              <p><strong>Name:</strong> {employee.name}</p>
              <p><strong>Email:</strong> {employee.email}</p>
              <p><strong>Role:</strong> {employee.role}</p>
              <p><strong>Location:</strong> {employee.location}</p>
              <p><strong>Phone:</strong> {employee.phone}</p>
              <button onClick={() => setEditMode(true)} className="edit-button">Edit Profile</button>
            </div>
          ) : (
            <div className="edit-profile">
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={updatedInfo.name}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={updatedInfo.email}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </label>
              <label>
                Location:
                <input
                  type="text"
                  name="location"
                  value={updatedInfo.location}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </label>
              <label>
                Phone:
                <input
                  type="text"
                  name="phone"
                  value={updatedInfo.phone}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </label>
              <div className="profile-buttons">
                <button onClick={handleSave} className="save-button">Save</button>
                <button onClick={() => setEditMode(false)} className="cancel-button">Cancel</button>
              </div>
            </div>
          )}
        </div>
  
        
      </div>
    );
  };
  
  export default employeeProfile;