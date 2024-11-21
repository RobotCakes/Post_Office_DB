import { useState } from 'react'

// testing desktop import { useAuth } from "./auth/SessionProvider"; make session provider for authentication? ~davis 

import './styles/App.css'
import { Routes, Route } from 'react-router-dom';

import reactLogo from './assets/react.svg'
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import TrackPackage from "./pages/trackPackage";

import CustomerHome from "./pages/customer/customerHome";
import PackageHistory from "./pages/customer/packageHistory";
import PackageStatus from "./pages/customer/packageStatus";
import Supplies from "./pages/customer/supplies";
import Payment from "./pages/customer/payment";

import BusinessHome from "./pages/business/businessHome";
import BusinessHistory from "./pages/business/businessHistory";
import BusinessStatus from "./pages/business/businessStatus";
import BusinessProfile from "./pages/business/businessProfile";
import BusinessPackage from "./pages/business/businessPackage";

import AdminHome from "./pages/admin/adminHome";
import EmployeeHome from "./pages/employee/employeeHome";
import EmployeeProfile from "./pages/employee/employeeProfile";
import ManagerHome from "./pages/employee/managerHome";
import IncomingPackages from "./pages/employee/incomingPackages";
import ManagePackage from "./pages/employee/managePackage";
import ManageSupplies from "./pages/employee/manageSupplies";
import ManageEmployee from "./pages/employee/manageEmployee";
import ManageTruck from "./pages/employee/manageTruck";


import ManageAllLocations from "./pages/admin/manageLocations";
import ManageAllOffices from "./pages/admin/manageAllOffices";
import ManageAllPackages from "./pages/admin/manageAllPackages";
import ManageAllSupplies from "./pages/admin/manageAllSupplies";
import ManageAllTrucks from "./pages/admin/manageAllTrucks";
import ManageAllEmployees from "./pages/admin/manageAllEmployees";

import AdminReports from "./pages/reports/adminReports";
import ManagerReports from "./pages/reports/managerReports";

import CustomerProfile from "./pages/customer/Profile";
import CreatePackage from './pages/employee/createPackage';
import CreateEmployee from './pages/employee/createEmployee';

function App() {
  const [count, setCount] = useState(0)

  return (
    
      <div className="App">
          <Routes>

            <Route path="/" element={<Home />} />

            <Route path="/track-package" element={<TrackPackage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />

            <Route path="/customer-home" element={<CustomerHome />} />
            <Route path="/package-history" element={<PackageHistory />} />
            <Route path="/package-status" element={<PackageStatus />} />
            <Route path="/customer-profile" element={<CustomerProfile />} />
            <Route path="/supplies" element={<Supplies />} />
            <Route path="/payment" element={<Payment />} />

            <Route path ="/business-home" element={<BusinessHome />} />
            <Route path ="/business-create-package" element={<BusinessPackage />} />
            <Route path ="/business-history" element={<BusinessHistory />} />
            <Route path ="/business-status" element={<BusinessStatus />} />
            <Route path ="/business-profile" element={<BusinessProfile />} />

            <Route path="/employee-home" element={<EmployeeHome />} />
            <Route path="/admin-home" element={<AdminHome />} />
            <Route path="/manager-home" element={<ManagerHome />} />
            <Route path="/incoming-packages" element={<IncomingPackages />} />
            <Route path="/manage-packages" element={<ManagePackage />} />
            <Route path="/manage-supplies" element={<ManageSupplies />} />
            <Route path="/manage-employees" element={<ManageEmployee />} />
            <Route path="/manage-trucks" element={<ManageTruck />} />
            <Route path="/employee-profile" element={<EmployeeProfile />} />
            <Route path="/create-package" element={<CreatePackage/>} />
            <Route path="/create-employee" element={<CreateEmployee />} />


            <Route path="/manage-all-locations" element={<ManageAllLocations />} />
            <Route path="/manage-all-offices" element={<ManageAllOffices />} />
            <Route path="/manage-all-packages" element={<ManageAllPackages />} />
            <Route path="/manage-all-supplies" element={<ManageAllSupplies />} />
            <Route path="/manage-all-trucks" element={<ManageAllTrucks />} />
            <Route path="/manage-all-employees" element={<ManageAllEmployees />} />
            

            <Route path="/admin-reports" element={<AdminReports />} />
            <Route path="/manager-reports" element={<ManagerReports />} />
          </Routes>

      </div>
      
      
  )
}

export default App