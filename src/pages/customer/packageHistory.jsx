import { useState, useEffect } from "react";
import { Link, useMatch, useResolvedPath, useNavigate } from "react-router-dom"
import { CustomerNavbar } from "../../components/Navbars";
import axios from 'axios';
import "../../styles/managePackage.css";

const PackageHistory = () => {
  const [packages, setPackages] = useState([]);
  const navigate = useNavigate();
  const userID = localStorage.getItem('userID');
  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    
    const getHistory = async () => {
      if (!userID) {
        alert('User not logged in');
        navigate('/');
      }

      try {
        const response = await axios.post('http://localhost:3000/user/package-history', { 
          userID: userID
        });
        setPackages(response.data); 
      } catch (error) {
        console.error('Error fetching packages:', error);
        alert('Failed to fetch packages');
      }
    };

    getHistory();
  }, []);


  return (
    <div className="container">
      <CustomerNavbar />

      <div className="manage-content">
        <h1>Package History</h1>
        <p>View package history below.</p>

        {/* Packages Table */}
        <table className="packages-table">
          <thead>
            <tr>
              <th>Tracking Number</th>
              <th>Status</th>
              <th>Content</th>
              <th>Time of Status</th>
              <th>Final Destination</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((pkg) => {
                const reformatDate = new Date(pkg.timeOfStatus).toLocaleString();
                return (
                  <tr key={pkg.id}>
                    <td>{pkg.trackingNumber}</td>
                    <td>{pkg.status}</td>
                    <td>{pkg.packageContent}</td>
                    <td>{reformatDate}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      <footer className="footer">
        <p>&copy; 2024 Texas Mail Services - Manage Packages. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default PackageHistory;