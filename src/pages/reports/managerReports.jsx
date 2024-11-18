import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { Link, Routes, Route, useMatch, useResolvedPath } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from 'axios';
import { Tab, Tabs, Table, Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ManagerNavbar } from "../../components/Navbars";

const managerReports = () => {
    const userID = localStorage.getItem('userID');
    const userRole = localStorage.getItem('userRole');
    const [incomeData, setIncomeData] = useState([]);
    const [statusData, setStatusData] = useState([]);
    const [packageData, setPackageData] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [activeTab, setActiveTab] = useState('income');

    const fetchReportData = async (report) => {
      try {
          const response = await axios.post(`/api/reports/${report}`, {
              startDate: startDate.toISOString(),
              endDate: endDate.toISOString(),
          });
          if (report === 'income') {
              setIncomeData(response.data);
          }
          if (report === 'status') {
              setStatusData(response.data);
          }
          if (report === 'packages') {
              setPackageData(response.data);
          }
      } catch (error) {
          console.error("Error fetching report data:", error);
      }
  };

      useEffect(() => {
        if (startDate && endDate) {
            fetchReportData(activeTab);
        }
    }, [startDate, endDate, activeTab]);

    useEffect(() => {
        const getInfo = async () => {
          if (!userID || userRole != 'manager') {
              alert('User not logged in');
              navigate('/');
          }
        };
      getInfo();
    }, []);


    return(
        <ManagerNavbar />

    )

}
export default managerReports;