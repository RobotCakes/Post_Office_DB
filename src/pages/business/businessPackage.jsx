//---------------------ASHLEY------------------------------------------------------
import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { Link, useMatch, useResolvedPath } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BusinessNavbar } from "../../components/Navbars";
import axios from 'axios';
import '../../styles/profile.css';

const CreatePackage = () => {
    const userID = localStorage.getItem('userID');
    const userRole = localStorage.getItem('userRole');
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
    const [isDelivery, setIsDelivery] = useState(false);
    const [deliveryPriority, setPrio] = useState('');
    const [isFragile, setFragile] = useState(false);
    const [specialInstructions, setInst] = useState('');
    const [deliverPrice, setPrice] = useState('');
    const [deliveryPriorities, setDeliveryPriorities] = useState([]);
    const [offices, setOffices] = useState([]);
    const [nextOID, setOID] = useState('');

    const handleCreatePackage = async (e) => {
        e.preventDefault(); 

        try {
            
            const response = await axios.post('https://post-backend-2f54f7162fc4.herokuapp.com/data/business-create-package', {
                userID, content, firstName, middleInitial, lastName, streetAddress, city, state, zipcode, country,
                packageHeight, packageLength, packageWidth, weight, isDelivery, deliveryPriority, isFragile, 
                specialInstructions, deliverPrice, nextOID
            });

            if (response.data.success) {
                alert('Package Created.')
            }
        } catch (error) {
            console.error('Could not create package:', error);
            if (error.response && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert('Package creation failed. Please try again.');
            }
        }
    };

    useEffect(() => {
    
        const getInfo = async () => {
            if (!userID || userRole != 'business') {
                alert('User not logged in');
                navigate('/');
            }

            try {
                const response = await axios.post('https://post-backend-2f54f7162fc4.herokuapp.com/data/get-prio');
                setDeliveryPriorities(response.data);

                const officeResponse = await axios.post('https://post-backend-2f54f7162fc4.herokuapp.com/data/get-offices');
                setOffices(officeResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                alert('Failed to fetch data.');
            }
        };
    
        getInfo();
      }, []); 

      const handlePriorityChange = (e) => {
        const selectedPriority = e.target.value;
        setPrio(selectedPriority);

        // Find the corresponding price for the selected priority
        const selectedPriorityObj = deliveryPriorities.find(
            (priority) => priority.deliveryPrio === parseInt(selectedPriority)
        );
        if (selectedPriorityObj) {
            const value = parseFloat(selectedPriorityObj.price).toFixed(2);
            setPrice(value); 
        }
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
                                maxLength={2}
                            />
                        </div>
                        <div>
                            <label>Zipcode:</label>
                            <input 
                                type="number" 
                                value={zipcode} 
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^\d{0,5}$/.test(value)) {
                                        setZipcode(value);
                                    }
                                }}
                                required
                                maxLength="5"
                                pattern="\d{5}"
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
                        <br />
                        <div>  
                            <label>Length (Feet):</label>
                            <input 
                                type="number" 
                                value={packageLength} 
                                required 
                                onChange={(e) => setLength(e.target.value)}
                                maxLength={10}
                            />
                        </div>
                        <div>  
                            <label>Width (Feet):</label>
                            <input 
                                type="number" 
                                value={packageWidth} 
                                required 
                                onChange={(e) => setWidth(e.target.value)}
                                maxLength={10}
                            />
                        </div>
                        <div>  
                            <label>Height (Feet):</label>
                            <input 
                                type="number" 
                                value={packageHeight} 
                                required 
                                onChange={(e) => setHeight(e.target.value)}
                                maxLength={10}
                            />
                        </div>
                        <div>  
                            <label>Weight (Pounds):</label>
                            <input 
                                type="number" 
                                value={weight} 
                                required 
                                onChange={(e) => setWeight(e.target.value)}
                                maxLength={10}
                            />
                        </div>
                        <br />
                        <div className="checkbox-group">
                            <label>
                                Delivery Required
                                <input
                                type="checkbox"
                                checked={isDelivery}
                                onChange={(e) => setIsDelivery(e.target.checked)}
                                />
                            </label>
                            <label>
                                Fragile
                                <input
                                type="checkbox"
                                checked={isFragile}
                                onChange={(e) => setFragile(e.target.checked)}
                                />
                            </label>
                        </div>
                        <br />
                        <div> 
                        <label>
                                Delivery Priority:
                                <select
                                    value={deliveryPriority}
                                    onChange={handlePriorityChange}
                                >
                                    <option value="">Select Priority</option>
                                    {deliveryPriorities.map((priority) => (
                                        <option key={priority.deliveryPrio} value={priority.deliveryPrio}>
                                            {priority.type}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>

                        <div>
                            <label>
                                Drop-off Post Office:
                                <select
                                value={nextOID}
                                onChange={(e) => setOID(e.target.value)}
                                >
                                <option value="">Select Office</option>
                                {offices.map((office) => (
                                    <option key={office.OID} value={office.OID}>
                                    {office.city}
                                    </option>
                                ))}
                                </select>
                            </label>
                        </div>

                        <h3>Special Instructions:</h3>
                            <textarea 
                            type="text" 
                            value={specialInstructions}  
                            onChange={(e) => setInst(e.target.value)}
                            placeholder="Ex. Handle with care"
                            maxLength={100}
                            className="input-field"
                            />
                        <br />
                        
                        <h3>Delivery Price: ${deliverPrice}</h3>
                </div>
                    <button type="submit">Create Package</button>
                </form>
          </div>
        </div>
    )
}

export default CreatePackage;
//---------------------ASHLEY (END)------------------------------------------------------