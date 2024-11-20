import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { Link, useMatch, useResolvedPath, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AdminNavbar } from "../../components/Navbars";
import '../../styles/employeeHome.css';
import axios from 'axios';
import { Button, Card, Row, Col, Container } from 'react-bootstrap';

const AdminHome = () => {
  const userID = localStorage.getItem('userID');
  const userRole = localStorage.getItem('userRole');
  const navigate = useNavigate();

  const navigateToReports = () => {
      navigate('/admin-reports');
  };

  const navigateToManageEmployees = () => {
      navigate('/manage-all-employees');
  };

  const navigateToManageLocations = () => {
      navigate('/manage-all-locations');
  };

  useEffect(() => {
      if (!userID || userRole !== 'admin') {
          alert('User not logged in');
          navigate('/');
      }
  }, [userID, userRole, navigate]);

  return (
      <div className="container">
          {/* Navigation bar */}
          <AdminNavbar />

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
                  <h1>Admin Dashboard</h1>
                  <h3>AID: {userID}</h3>
                  <p>Manage employees, locations, and view reports from this dashboard.</p>
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

                      {/* Manage Locations Card */}
                      <Col sm={4}>
                          <Card>
                              <Card.Body>
                                  <Card.Title>Manage Locations</Card.Title>
                                  <Button variant="info" onClick={navigateToManageLocations}>
                                      Manage Locations
                                  </Button>
                              </Card.Body>
                          </Card>
                      </Col>
                  </Row>
              </Container>
          </div>

          {/* Footer */}
          <footer className="footer">
              <p>&copy; 2024 United Mail Services - Admin Dashboard. All rights reserved.</p>
          </footer>
      </div>
  );
};

export default AdminHome;