// ------------ASHLEY-------------------------------------------------
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ManagerNavbar } from "../../components/Navbars";
import "../../styles/managePackage.css";
import axios from 'axios';

const ManageEmployee = () => {
  const userID = localStorage.getItem('userID');
  const userRole = localStorage.getItem('userRole');
  const [employeeList, setEmployeeList] = useState([]);
  const [filterEmployee, setFilterEmployee] = useState([]);
  const [searchEmployee, setSearchEmployee] = useState("");
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Ensure manager is logged in
    if (!userID || userRole !== 'manager') {
      alert('User not logged in');
      navigate('/');
      return;
    }

    // Fetch employee data
    const fetchEmployees = async () => {
        try {
            const response = await axios.post('https://post-backend-2f54f7162fc4.herokuapp.com/manager/get-employees', { userID });
            setEmployeeList(response.data);
        } catch (error) {
            console.error('Error fetching employees:', error);
            setError('Failed to fetch employee data');
        }
        };

        fetchEmployees();
    }, [success]);

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchEmployee(query);

        const filtered = employeeList.filter((emp) =>
            (emp.firstName && emp.firstName.toLowerCase().includes(query.toLowerCase())) || 
            (emp.EID && emp.EID.toString().includes(query)) 
        );

        setFilterEmployee(filtered);
    };

    const handleDeleteEmployee = async (employeeID) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this employee?");

        if (!confirmDelete) {
            return; 
        }

        setSuccess(""); 
        setError("");
        try {
            const result = await axios.post('https://post-backend-2f54f7162fc4.herokuapp.com/manager/delete-employees', {
                EID: employeeID, userID, userRole
        });
            setSuccess('Employee updated successfully.');
        } catch (error) {
            setError('Failed to delete employee');
            console.log(error);
        }
    };

    return (
        <div className="container">
            <ManagerNavbar />

            <div className="manage-content">
                <h1>Manage Employees</h1>
                <p>Add and delete employees from the post office.</p>

                <button className="create-button" onClick={() => navigate('/create-employee')}>
                    Add Employee
                </button>

                {/* Search Bar */}
                <input
                    type="text"
                    placeholder="Search by Name or Email"
                    value={searchEmployee}
                    onChange={handleSearch}
                    className="search-bar"
                />

                {success && <p className="success-message">{success}</p>}
                {error && <p className="error-message">{error}</p>}

                {/* Employees Table */}
                <table className="packages-table">
                <thead>
                    <tr>
                        <th>Employee ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {(filterEmployee.length > 0 ? filterEmployee : employeeList).map(emp => (
                        <tr key={emp.EID}>
                        <td>{emp.EID}</td>
                        <td>{emp.firstName} {emp.middleInitial} {emp.lastName}</td>
                        <td>{emp.email}</td>
                        <td>
                            <button
                                className="info-button"
                                onClick={() => handleDeleteEmployee(emp.EID)}
                            >
                                {emp.isDeleted ? "Reactivate" : "Delete"}
                            </button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageEmployee;