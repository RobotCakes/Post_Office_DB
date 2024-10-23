import React from 'react';
import { useContext, useEffect } from "react";
import { Route, Routes, useRoutes } from "react-router-dom";
import { Session } from "../../server/trpc/auth/auth";
import { AuthContext, AuthProvider } from "./auth/SessionProvider";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";
import Tracking from "./pages/trackPackage";

import AdminHome from "./pages/admin/adminHome";
import CustomerHome from "./pages/customer/customerHome";
import PackageHistory from "./pages/customer/packageHistory";
import PackageStatus from "./pages/customer/packageStatus";

import EmployeeHome from "./pages/employee/employeeHome";
import IncomingPackages from "./pages/employee/incomingPackages";
import ManagePackage from "./pages/employee/managePackage";
import ManageSupplies from "./pages/employee/manageSupplies";
import ManageEmployee from "./pages/employee/manageEmployee";
import ManageTruck from "./pages/employee/manageTruck";
import ManagerHome from "./pages/employee/managerHome";

import ManageAllLocations from "./pages/admin/manageAllLocations";
import ManageAllOffices from "./pages/admin/manageAllOffices";
import ManageAllPackages from "./pages/admin/manageAllPackages";
import ManageAllSupplies from "./pages/admin/manageAllSupplies";
import ManageAllTrucks from "./pages/admin/manageAllTrucks";
import ManageAllEmployees from "./pages/admin/manageAllEmployees";

import AdminReports from "./pages/reports/adminReports";
import ManagerReports from "./pages/reports/managerReports";

const baseRoutes = [
    { path: "/", index: true, element: <Home />, label: "Home", isNav: true },
    { path: "track-package", element: <Tracking />, label: "Tracking", isNav: false },
    { path: "signup", element: <Signup />, label: "Signup", isNav: false },
    { path: "login", element: <Login />, label: "Login", isNav: false },
];

const customerRoutes = [
    {path: "customer-home", element: <CustomerHome />, label: "Home", isNav: true},
    {path: "package-history", element: <PackageHistory />, label: "Package History", isNav:true},
    {path: "package-status", element: <PackageStatus />, label: "Package Status", isNav:true},
    {path: "manager-profile", element: <Profile />, label: "Profile",isNav: false},
];

const employeeRoutes = [
    {path: "employee-home", element: <EmployeeHome />, label: "Home", isNav: true},
    {path: "package-history", element: <ManagePackage />, label: "Manage Packages", isNav:true},
    {path: "manage-supplies", element: <ManageSupplies />, label: "Manage Supplies", isNav:true},
    {path: "incoming-packages", element: <IncomingPackages />, label: "Incoming Packages", isNav: true},
    {path: "employee-profile", element: <Profile />, label: "Profile",isNav: false},
];  

const managerRoutes = [
    {path: "manager-home", element: <ManagerHome />, label: "Home", isNav: true},
    {
      path: "/manage-location",
      element: <ManageLocation />,
      label: "Manage Location",
      isNav: true,
      children: [
        { path: "manage-packages", element: <ManagePackage />, label: "Manage Packages" },
        { path: "manage-employees", element: <ManageEmployee />, label: "Manage Employees" },
        { path: "manage-trucks", element: <ManageTruck />, label: "Manage Trucks" },
        { path: "manage-supplies", element: <ManageSupplies />, label: "Manage Supplies" },
      ],
    },
    {path: "incoming-packages", element: <IncomingPackages />, label: "Incoming Packages", isNav: true},
    {path: "manager-reports", element: <ManagerReports />, Label: "Reports", isNav: true},
    {path: "manager-profile", element: <Profile />, label: "Profile",isNav: false},
];

const adminRoutes = [
    {path: "admin-home", element: <AdminHome />, label: "Home", isNav: true},
    {
      path: "/manage-location",
      element: <ManageAllLocations />,
      label: "Manage Location",
      isNav: true,
      children: [
        { path: "manage-packages", element: <ManageAllPackages />, label: "Manage Packages" },
        { path: "manage-employees", element: <ManageAllEmployees />, label: "Manage Employees" },
        { path: "manage-trucks", element: <ManageAllTrucks />, label: "Manage Trucks" },
        { path: "manage-trucks", element: <ManageAllOffices />, label: "Manage Trucks" },
        { path: "manage-supplies", element: <ManageAllSupplies />, label: "Manage Supplies" },
      ],
    },
    {path: "admin-reports", element: <AdminReports />, Label: "Reports", isNav: true},
    {path: "admin-profile", element: <Profile />, label: "Profile",isNav: false},
];

const AppRoutes = () => {


}

export default AppRoutes;