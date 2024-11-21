import { useRef, useState, useEffect } from "react";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import {
  Link,
  Routes,
  Route,
  useMatch,
  useResolvedPath,
  useNavigate
} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { Tab, Tabs, Table, Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ManagerNavbar } from "../../components/Navbars";
import "../../styles/managePackage.css";

const managerReports = () => {
  const userID = localStorage.getItem('userID');
  const userRole = localStorage.getItem('userRole');
  const [incomeData, setIncomeData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [packageData, setPackageData] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState("income");
  const [timeframe, setTimeframe] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reportData, setReportData] = useState('');
  const navigate = useNavigate();
  const [queryType, setQueryType] = useState('');

  const handleQueryChange = (event) => {
    setQueryType(event.target.value);
  };

  const fetchReportData = async (report) => {
    try {
      const response = await axios.post(`https://post-backend-2f54f7162fc4.herokuapp.com/admin-reports/${report}`, {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });
      if (report === "income") {
        setIncomeData(response.data);
      }
      if (report === "status") {
        setStatusData(response.data);
      }
      if (report === "packages") {
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
      if (!userID || userRole != "manager") {
        alert("User not logged in");
        navigate("/");
      }
    };
    getInfo();
  }, []);

  const handleTimeframeChange = (event) => {
    setTimeframe(event.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      /* DEF WRONG FOR POST */
      const response = await axios.post(
        `https://post-backend-2f54f7162fc4.herokuapp.com/admin-reports/total-packages-deleted`,
        {
          queryType,
          timeframe,
        }
      );
      setReportData(response.data);
    } catch (err) {
      setError("Failed to fetch report data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="container">
      <ManagerNavbar />
      <h1>Reports Page</h1>
      <div className="form-controls">
        <label htmlFor="query-type">Select Query Type:</label>
        <select id="query-type" value={queryType} onChange={handleQueryChange}>
          <option value="ManagerIncomeBasedOnPayment">
            Manager Income Based On Payment
          </option>
          <option value="ManagerIncomeBasedOnPackage">
            Manager Income Based On Package
          </option>
          <option value="ManagerTotalPacketsIncomingNOutgoing">
            Manager Total Packets Incoming & Outgoing
          </option>
          <option value="ManagerTotalSuppliesSold">
            Manager Total Supplies Sold
          </option>
          <option value="ManagerEmployeeWorkload">
            Manager Employee Workload
          </option>
          <option value="ManagerTotalPackagesDeleted">
            Manager Total Packages Deleted
          </option>
        </select>

        <label htmlFor="timeframe">Select Timeframe:</label>
        <select
          id="timeframe"
          value={timeframe}
          onChange={handleTimeframeChange}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
          <option value="alltime">All Time</option>
        </select>

        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Loading..." : "Generate Report"}
        </button>
      </div>

      {error && <div className="error">{error}</div>}
      {reportData && (
        <div className="report-results">
          <h2>Report Results</h2>
          <pre>{JSON.stringify(reportData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};
export default managerReports;
