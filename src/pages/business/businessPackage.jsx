//---------------------ASHLEY------------------------------------------------------
import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { Link, useMatch, useResolvedPath } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BusinessNavbar } from "../../components/Navbars";
import '../../styles/profile.css';

const CreatePackage = () => {
    const userID = localStorage.getItem('userID');
    const [content, setContent] = useState('');
    const [firstName, setFirstName] = useState('');
    const [middleInitial, setMiddleInitial] = useState('');
    const [lastName, setLastName] = useState('');
    const [streetAddress, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [country, setCountry] = useState('');
    const [packageLength, setLength] = useState('');
    const [packageHeight, setHeight] = useState('');
    const [packageWidth, setWidth] = useState('');
    const [weight, setWeight] = useState('');
    const [isDelivery, setIsDelivery] = useState('');
    const [deliveryPriority, setPrio] = useState('');
    const [isFragile, setFragile] = useState('');
    const [specialInstructions, seteInst] = useState('');
    const  [deliverPrice, setPrice] = useState('');

    const handleCreatePackage = (e) => {
        e.preventDefault();  
    };

    // These forms look so bad but I need them functional
    return (
        <div className="container">
          <BusinessNavbar />

          <div className="profile-content">
                <h1>Create Package</h1>
                <form onSubmit={handleCreatePackage} className="profile-form">
                        <h3>Receiver</h3>
                        <div className="input-format">
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

                    
                        <div>
                            <label>Street Address:</label>
                            <input 
                                type="text" 
                                value={streetAddress} 
                                required 
                                onChange={(e) => setStreet(e.target.value)}
                                maxLength={50}
                            />
                        </div>
                        <div>
                            <label>City:</label>
                            <input 
                                type="text" 
                                value={city} 
                                onChange={(e) => setCity(e.target.value)}
                                maxLength={20}
                            />
                        </div>
                        <div>
                            <label>State:</label>
                            <input 
                                type="text" 
                                value={state} 
                                required 
                                onChange={(e) => setState(e.target.value)}
                                maxLength={20}
                            />
                        </div>
                        <div>
                            <label>Zipcode:</label>
                            <input 
                                type="text" 
                                value={zipcode} 
                                onChange={(e) => setZipcode(e.target.value)}
                                maxLength={20}
                            />
                        </div>
                        <div>
                            <label>Country:</label>
                            <input 
                                type="text" 
                                value={country} 
                                required 
                                onChange={(e) => setCountry(e.target.value)}
                                maxLength={20}
                            />
                        </div>

                    
                        <h3>Package Content:</h3>
                        <textarea 
                        type="text" 
                        value={content} 
                        required 
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Ex. Books, Phone"
                        maxLength={255}
                        className="input-field"
                        />

                        <div></div>
                    


                </div>

                    

                    <button type="submit">Create Package</button>
                </form>
          </div>
        </div>
    )
}

export default CreatePackage;
//---------------------ASHLEY (END)------------------------------------------------------