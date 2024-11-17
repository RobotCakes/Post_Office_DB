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
} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AdminNavbar } from "../../components/Navbars";
const adminReports = () => {
  const [queryType, setQueryType] = useState("AdminIncomeBasedOnPayment");
  const [timeframe, setTimeframe] = useState("daily");
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleQueryChange = (event) => {
    setQueryType(event.target.value);
  };

  const handleTimeframeChange = (event) => {
    setTimeframe(event.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      /* PROB WRONG FOR POST */
      const response = await axios.post(
        "http://localhost:3001/admin/total-packages-deleted",
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
      <AdminNavbar />
      <h1>Reports Page</h1>
      <div className="form-controls">
        <label htmlFor="query-type">Select Query Type:</label>
        <select id="query-type" value={queryType} onChange={handleQueryChange}>
          <option value="AdminIncomeBasedOnPayment">
            Admin Income Based On Payment
          </option>
          <option value="AdminIncomeBasedOnPackage">
            Admin Income Based On Package
          </option>
          <option value="AdminTotalPacketsIncomingNOutgoing">
            Admin Total Packets Incoming & Outgoing
          </option>
          <option value="AdminTotalSuppliesSold">
            Admin Total Supplies Sold
          </option>
          <option value="AdminTotalPackagesDeleted">
            Admin Total Packages Deleted
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
export default adminReports;
