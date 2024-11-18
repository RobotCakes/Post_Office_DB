// ------------ASHLEY-------------------------------------------------
import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { Link, Routes, Route, useMatch, useResolvedPath, useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ManagerNavbar, EmployeeNavbar } from "../../components/Navbars"
import axios from 'axios';
import "../../styles/profile.css"
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@$]).{8,20}$/;

const Profile = () => {
    const [firstName, setFirstName] = useState('');
    const [middleInit, setMiddleInit] = useState('');
    const [lastName, setLastName] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zip, setZip] = useState('');
    const [country, setCountry] = useState('');
    const [pwd, setPwd] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumer] = useState('');
    const [pwdValid, setPwdValid] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const userID = localStorage.getItem('userID');
    const userRole = localStorage.getItem('userRole');
    const navigate = useNavigate();

    const handlePasswordChange = (e) => {
        const password = e.target.value;
        setPwd(password);
    
        const isValid = PWD_REGEX.test(password);
        setPwdValid(isValid);
    
        if (!isValid) {
            setErrMsg("Password must meet the criteria.");
        } else {
            setErrMsg("");
        }
    };

    {/* Get user info first thing */}
    useEffect(() => {
    
        const getInfo = async () => {
          if (!userID || (userRole != 'employee' && userRole != 'manager')) {
            alert('User not logged in');
            navigate('/');
          }
    
          try {
            const response = await axios.post('https://post-backend-2f54f7162fc4.herokuapp.com/employee/employee-info', { 
              userID: userID
            });
            
            setFirstName(response.data.firstName);
            setMiddleInit(response.data.middleInitial);
            setLastName(response.data.lastName);
            setStreet(response.data.streetAddress);
            setCity(response.data.city);
            setState(response.data.state);
            setZip(response.data.zipcode);
            setCountry(response.data.country);
            setPwd(response.data.password);
            setPhoneNumer(response.data.phoneNumber);
            setEmail(response.data.email);

          } catch (error) {
            console.error('Error getting user info:', error);
            alert('Failed to get user info');
          }
        };
    
        getInfo();
      }, []); 

      const handleSubmit = async (e) => {
        e.preventDefault();
        const v2 = PWD_REGEX.test(pwd);
        if (!v2) {
            setErrMsg("Invalid Entry");
            return;
        }
        try {
            const response = await axios.post('https://post-backend-2f54f7162fc4.herokuapp.com/employee/update-info', {
                userID: userID,
                userRole: userRole,
                firstName: firstName,
                middleInitial: middleInit,
                lastName: lastName,
                streetAddress: street,
                city: city,
                state: state,
                zipcode: zip,
                country: country,
                password: pwd,
                phoneNumber: phoneNumber,
                email: email
            });

            if (response.data.success) {
                alert('Profile updated successfully');
            } else {
                alert('Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error updating profile');
        }
    };

    return(
        <div className="container">
            {userRole === 'employee' && <EmployeeNavbar />}
            {userRole === 'manager' && <ManagerNavbar />}

            <div className="profile-content">
                <h1>Edit Profile</h1>
                    <form onSubmit={handleSubmit} className="profile-form">
                        <div className="input-format">
                            <label>
                                Password: 
                                <input
                                    type="password"
                                    value={pwd}
                                    onChange={handlePasswordChange}
                                    required
                                />
                            </label>
                            {errMsg && <p className="error-msg">{errMsg}</p>}
                            <div className="password-requirements">
                                <ul >
                                    <li>8-20 characters</li>
                                    <li>At least one uppercase letter</li>
                                    <li>At least one lowercase letter</li>
                                    <li>At least one number</li>
                                    <li>At least one special character (!, @, or $)</li>
                                </ul>
                            </div>
                            <br />
                            <label>
                                First Name:
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                    maxLength="20"
                                />
                            </label>
                            <br />
                            <label>
                                Middle Initial:
                                <input
                                    type="text"
                                    value={middleInit}
                                    onChange={(e) => setMiddleInit(e.target.value)}
                                    maxLength="1"
                                />
                            </label>
                            <br />
                            <label>
                                Last Name:
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                    maxLength="20"
                                />
                            </label>
                            <br />
                            <label>
                                Phone Number:
                                <input
                                    type="text"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumer(e.target.value)}
                                    maxLength="20"
                                />
                            </label>
                            <br />
                            
                            <label>
                                Email:
                                <input
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    maxLength="30"
                                />
                            </label>
                        </div>
                        <button type="submit">Save Changes</button>
                    </form>
                
            </div>
            
        </div>
    );

};
export default Profile;
// ------------ASHLEY (END)-------------------------------------------------