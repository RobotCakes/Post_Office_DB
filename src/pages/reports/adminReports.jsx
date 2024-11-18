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
  const [queryType, setQueryType] = useState();
  const [timeframe, setTimeframe] = useState();
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
    if (!queryType) {
      setError("Please select table type");
      console.error(err);
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `https://post-backend-2f54f7162fc4.herokuapp.com/admin-report/${queryType}`,
        {
          queryType,
          timeframe,
        }
      );
      console.log(response);

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
      {queryType === "AdminIncomeBasedOnPayment" && !!reportData && (
        <>
          <table
            border="1"
            style={{ borderCollapse: "collapse", width: "100%" }}
          >
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Age</th>
                <th>Profession</th>
              </tr>
            </thead>
            <tbody>
              {reportData.sum?.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.age}</td>
                  <td>{item.profession}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <table
            border="1"
            style={{ borderCollapse: "collapse", width: "100%" }}
          >
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Age</th>
                <th>Profession</th>
              </tr>
            </thead>
            <tbody>
              {reportData.tuples?.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.age}</td>
                  <td>{item.profession}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {queryType === "AdminIncomeBasedOnPackage" && !!reportData && (
        <>
          <table
            border="1"
            style={{ borderCollapse: "collapse", width: "100%" }}
          >
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Age</th>
                <th>Profession</th>
              </tr>
            </thead>
            <tbody>
              {reportData?.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.age}</td>
                  <td>{item.profession}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <table
            border="1"
            style={{ borderCollapse: "collapse", width: "100%" }}
          >
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Age</th>
                <th>Profession</th>
              </tr>
            </thead>
            <tbody>
              {reportData?.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.age}</td>
                  <td>{item.profession}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {queryType === "AdminTotalSuppliesSold" && !!reportData && (
        <>
          <table
            border="1"
            style={{ borderCollapse: "collapse", width: "100%" }}
          >
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Age</th>
                <th>Profession</th>
              </tr>
            </thead>
            <tbody>
              {reportData?.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.age}</td>
                  <td>{item.profession}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <table
            border="1"
            style={{ borderCollapse: "collapse", width: "100%" }}
          >
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Age</th>
                <th>Profession</th>
              </tr>
            </thead>
            <tbody>
              {reportData?.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.age}</td>
                  <td>{item.profession}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {queryType === "AdminTotalPackagesDeleted" && !!reportData && (
        <>
          <table
            border="1"
            style={{ borderCollapse: "collapse", width: "100%" }}
          >
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Age</th>
                <th>Profession</th>
              </tr>
            </thead>
            <tbody>
              {reportData?.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.age}</td>
                  <td>{item.profession}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <table
            border="1"
            style={{ borderCollapse: "collapse", width: "100%" }}
          >
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Age</th>
                <th>Profession</th>
              </tr>
            </thead>
            <tbody>
              {reportData?.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.age}</td>
                  <td>{item.profession}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
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
