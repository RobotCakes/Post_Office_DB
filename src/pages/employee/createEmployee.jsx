
// ------------ASHLEY-------------------------------------------------
import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { Link, Routes, Route, useMatch, useResolvedPath, useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ManagerNavbar } from "../../components/Navbars";
import "../../styles/managePackage.css";
import axios from 'axios';
import ReactModal from "react-modal";

const createEmployee = () => {
    const navigate = useNavigate();
    const userID = localStorage.getItem('userID');
    const userRole = localStorage.getItem('userRole');
    const [firstName, setFirstName] = useState('');
    const [middleInitial, setMiddleInitial] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [pwd, setpwd] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isManager, setIsManager] = useState(false); // Added to make porting to admin easier
    const [OID, setOID] = useState('');

    useEffect(() => {
        
        const getStatus = async () => {
            if (!userID || (userRole != 'employee' && userRole != 'manager')) {
                alert('User not logged in');
                navigate('/');
            }

            try {
                const infoResponse = await axios.post('https://post-backend-2f54f7162fc4.herokuapp.com/employee/get-location', { userID });
                if (infoResponse.data && infoResponse.data.length > 0) {
                    setOID(infoResponse.data[0].OID);
                } else {
                    console.log('No location assigned');
                }

            } catch (error) {
                console.error('Error fetching information:', error);
                alert('Failed to get information');
            }
        };

        getStatus();
      }, []);


      const handleEmployee = async (e) => {
        e.preventDefault();

        try {
            
            const response = await axios.post('http://localhost:3000/manager/add-employee', {
                userID, userRole, firstName, lastName, middleInitial,email, username, pwd, isManager, OID
            });

            if (response.data.success) {
                alert('Employee Added.')
            }
        } catch (error) {
            console.error('Could not add employee:', error);
            if (error.response && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert('Adding employee failed. Please try again.');
            }
        }

      };

      return(
        <div className="container">
            <ManagerNavbar />
            <h2>Add New Employee</h2>
                {loading && <p>Loading...</p>}
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleEmployee}>
                            <div className="input-format">
                                <label>Username:</label>
                                <input 
                                type="text" 
                                value={username} 
                                required 
                                onChange={(e) => setUsername(e.target.value)}
                                maxLength={20}
                                />

                                <label>Password:</label>
                                <input 
                                type="password" 
                                value={pwd} 
                                required 
                                onChange={(e) => setpwd(e.target.value)}
                                maxLength={20}
                                />

                                <br />

                                <label>First Name:</label>
                                <input 
                                type="text" 
                                value={firstName} 
                                required 
                                onChange={(e) => setFirstName(e.target.value)}
                                maxLength={20}
                                />
                              
                                <div>
                                    <label>Middle Initial:</label>
                                    <input 
                                    type="text" 
                                    value={middleInitial} 
                                    onChange={(e) => setMiddleInitial(e.target.value)}
                                    maxLength={1}
                                    />
                                </div>
                              
                                <label>Last Name:</label>
                                <input 
                                type="text" 
                                value={lastName} 
                                required 
                                onChange={(e) => setLastName(e.target.value)}
                                maxLength={20}
                                />

                                <label>Email:</label>
                                <input 
                                type="text" 
                                value={email} 
                                required 
                                onChange={(e) => setEmail(e.target.value)}
                                maxLength={20}
                                />

                            </div>
                            <button type="submit">Add Employee</button>
                </form>
        </div>
      )

};

export default createEmployee;