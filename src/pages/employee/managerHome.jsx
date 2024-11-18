//ASHLEY
import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { Link, useMatch, useResolvedPath, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ManagerNavbar } from "../../components/Navbars";
import '../../styles/employeeHome.css';
import axios from 'axios';
import { Button, Card, Row, Col, Container } from 'react-bootstrap';

const managerHome = () => {
    const userID = localStorage.getItem('userID');
    const userRole = localStorage.getItem('userRole');
    const [info, setInfo] = useState('');
    const navigate = useNavigate();

    const navigateToReports = () => {
      navigate('/manager-reports');
    };

    const navigateToManageEmployees = () => {
      navigate('/manage-employees');
    };


    useEffect(() => {
    
      const getInfo = async () => {
          if (!userID || userRole != 'manager') {
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
        <ManagerNavbar />
  
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
            <h1>Manager Dashboard</h1>
            <h3>EID: {userID}</h3>
            <h3>Assigned Location: {info}</h3>
            <p>Access package management, supplies, and other manager resources here.</p>
          </div>

          <Container>
            <Row className="my-4">
              {/* Reports Card */}
              <Col sm={4}>
                <Card>
                  <Card.Body>
                    <Card.Title>Reports</Card.Title>
                    <Button variant="primary" onClick={navigateToReports}>
                      Go to Reports
                    </Button>
                  </Card.Body>
                </Card>
              </Col>

              {/* Manage Employees Card */}
              <Col sm={4}>
                <Card>
                  <Card.Body>
                    <Card.Title>Manage Employees</Card.Title>
                    <Button variant="secondary" onClick={navigateToManageEmployees}>
                      Manage Employees
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
  
        </div>
          
        

        
      </div>

    )
}

export default managerHome;