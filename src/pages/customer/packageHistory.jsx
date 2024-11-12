import { useState, useEffect } from "react";
import { CustomerNavbar } from "../../components/Navbars";
import "../../styles/managePackage.css";

const PackageHistory = () => {
  const [packages, setPackages] = useState([]);

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
            </tr>
          </thead>
          <tbody>
            {packages.map((pkg) => (
              <tr key={pkg.id}>
                <td>{pkg.trackingNumber}</td>
                <td>{pkg.status}</td>
                <td>{pkg.packageContent}</td>
                <td>{pkg.timeOfStatus}</td>
              </tr>
            ))}
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