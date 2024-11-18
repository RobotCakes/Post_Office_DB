import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { Link, useMatch, useResolvedPath, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { EmployeeNavbar } from "../../components/Navbars";
import axios from 'axios';
import '../../styles/employeeHome.css';

const EmployeeHome = () => {
    const userID = localStorage.getItem('userID');
    const userRole = localStorage.getItem('userRole');
    const [info, setInfo] = useState('');

    useEffect(() => {
    
      const getInfo = async () => {
          if (!userID || userRole != 'employee') {
              alert('User not logged in');
              navigate('/');
          }
    
              try {
    
                const infoResponse = await axios.post('https://post-backend-2f54f7162fc4.herokuapp.com/employee/get-location', { userID });
                if (infoResponse.data && infoResponse.data.length > 0) {
                  setInfo(infoResponse.data[0].city);
                } else {
                  setInfo('No location assigned');
                }
    
              } catch (error) {
                console.error('Error getting employee info:', error);
                alert('Failed to get employee information.');
              }
    
            };
      getInfo();
    }, []);
  
    return (
      <div className="container">
        {/* Navigation bar */}
        <EmployeeNavbar />
  
        {/* Main content area */}
        <div className="home-content" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 200px)', // Adjust this value based on nav and footer height
          textAlign: 'center',
          padding: '50px'
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1>Employee Dashboard</h1>
            <h3>EID: {userID}</h3>
            <h3>Assigned Location: {info}</h3>
            <p>Access package management, supplies, and other employee resources here.</p>
          </div>
  
          {/* Quick Stats Section 
          <div className="quick-stats" style={{
            width: '100%',
            maxWidth: '600px',
            textAlign: 'center',
            marginTop: '20px'
          }}>
            <h2>Quick Stats</h2>
            <p>Incoming Packages Today: 12</p>
            <p>Low Supplies: Tape, Boxes</p>
          </div>*/}
  
          
        </div>
          

        
      </div>
    );
  };
  
  export default EmployeeHome;

