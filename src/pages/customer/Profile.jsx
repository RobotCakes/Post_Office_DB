// ------------ASHLEY-------------------------------------------------
import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { Link, Routes, Route, useMatch, useResolvedPath } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {CustomerNavbar} from "../../components/Navbars"
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
    const [pwdValid, setPwdValid] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const userID = localStorage.getItem('userID');

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
          if (!userID) {
            alert('User not logged in');
            navigate('/');
          }
    
          try {
            const response = await axios.post('https://post-backend-2f54f7162fc4.herokuapp.com/user/customer-info', { 
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
            const response = await axios.post('https://post-backend-2f54f7162fc4.herokuapp.com/user/update-info', {
                userID: userID,
                firstName: firstName,
                middleInitial: middleInit,
                lastName: lastName,
                streetAddress: street,
                city: city,
                state: state,
                zipcode: zip,
                country: country,
                password: pwd
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
            <CustomerNavbar />

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
                                Street Address:
                                <input
                                    type="text"
                                    value={street}
                                    onChange={(e) => setStreet(e.target.value)}
                                    required
                                    maxLength="50"
                                />
                            </label>
                            <br />
                            <label>
                                City:
                                <input
                                    type="text"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    required
                                    maxLength="20"
                                />
                            </label>
                            <br />
                            <label>
                                State:
                                <input
                                    type="text"
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                    required
                                    maxLength="2"
                                />
                            </label>
                            <br />
                            <label>
                                Country:
                                <input
                                    type="text"
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                    required
                                    maxLength="56"
                                />
                            </label>
                            <br />
                            <label>
                                Zip Code:
                                <input
                                    type="text"
                                    value={zip}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (/^\d{0,5}$/.test(value)) {
                                            setZip(value);
                                        }
                                    }}
                                    required
                                    maxLength="5"
                                    pattern="\d{5}"
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