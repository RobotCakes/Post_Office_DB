// ------------ASHLEY-------------------------------------------------
import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { Link, Routes, Route, useMatch, useResolvedPath } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BusinessNavbar } from "../../components/Navbars"
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
    const [businessName, setBusinessName] = useState('');
    const [pwdValid, setPwdValid] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const userID = localStorage.getItem('userID');
    const userRole = localStorage.getItem('userRole');
    
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

    
    useEffect(() => {
    
        const getInfo = async () => {
            if (!userID || userRole != 'business') {
                alert('User not logged in');
                navigate('/');
            }
    
          try {
            const response = await axios.post('https://post-backend-2f54f7162fc4.herokuapp.com/user/business-info', { 
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
            setEmail(response.data.email);
            setBusinessName(response.data.businessName);

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
            const response = await axios.post('https://post-backend-2f54f7162fc4.herokuapp.com/user/business-profile-update', {
                userID: userID,
                firstName: firstName,
                middleInitial: middleInit,
                lastName: lastName,
                streetAddress: street,
                city: city,
                state: state,
                zipcode: zip,
                country: country,
                password: pwd,
                email: email,
                businessName: businessName
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
            <BusinessNavbar />

            <div className="profile-content">
                <h1>Edit Profile</h1>
                    <form onSubmit={handleSubmit} className="profile-form">
                        <div className="input-format">
                            <label>
                                Password:   </label>
                                <input
                                    type="password"
                                    value={pwd}
                                    onChange={handlePasswordChange}
                                    required
                                />
                            
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
                                First Name:  </label>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                    maxLength="20"
                                />
                            
                            <br />
                            <label>
                                Middle Initial:   </label>
                                <input
                                    type="text"
                                    value={middleInit}
                                    onChange={(e) => setMiddleInit(e.target.value)}
                                    maxLength="1"
                                />
                            
                            <br />
                            <label>
                                Last Name:  </label>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                    maxLength="20"
                                />
                            
                            <br />
                            <label>
                                Business Name: </label>
                                <input
                                    type="text"
                                    value={businessName}
                                    onChange={(e) => setBusinessName(e.target.value)}
                                    required
                                    maxLength="50"
                                />
                            
                            <br />
                            <label>
                                Street Address: </label>
                                <input
                                    type="text"
                                    value={street}
                                    onChange={(e) => setStreet(e.target.value)}
                                    required
                                    maxLength="50"
                                />
                            
                            <br />
                            
                            
                            <label>
                                Email: </label>
                                <input
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    maxLength="30"
                                />
                            
                            <br />
                            <label>
                                City: </label>
                                <input
                                    type="text"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    required
                                    maxLength="20"
                                />
                            
                            <br />
                            <label>
                                State: </label>     
                                <input
                                    type="text"
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                    required
                                    maxLength="2"
                                />
                            
                            <br />
                            <label> Country: </label>
                                <input
                                    type="text"
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                    required
                                    maxLength="56"
                                />
                            
                            <br />
                            <label> Zip Code: </label>
                                <input
                                    type="number"
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
                            
                        </div>
                        <button type="submit">Save Changes</button>
                    </form>
                
            </div>
            
        </div>
    );

};
export default Profile;
// ------------ASHLEY (END)-------------------------------------------------