// ------------ASHLEY-------------------------------------------------
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ManagerNavbar } from "../../components/Navbars";
import "../../styles/managePackage.css";
import ReactModal from "react-modal";
import axios from 'axios';

const ManageEmployee = () => {
    const userID = localStorage.getItem('userID');
    const userRole = localStorage.getItem('userRole');
    const [employeeList, setEmployeeList] = useState([]);
    const [filterEmployee, setFilterEmployee] = useState([]);
    const [searchEmployee, setSearchEmployee] = useState("");
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
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
        const confirmDelete = window.confirm("Are you sure you want to delete or reactivate this employee?");

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

    const openModal = (emp) => {
        setSelectedEmployee(emp);
        setModalOpen(true);
    };

    const closeModal = () => {
        setSelectedEmployee(null);
        setModalOpen(false);
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible((prev) => !prev);
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


                <table className="packages-table">
                <thead>
                    <tr>
                        <th>Employee ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Login</th>
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
                                    onClick={() => openModal(emp)}
                                >
                                    View
                            </button></td>
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
            <ReactModal
                isOpen={modalOpen}
                onRequestClose={closeModal}
                contentLabel="Employee Info"
                className="custom-modal"
                overlayClassName="custom-overlay"
            >
                <h2>Employee Details</h2>
                {selectedEmployee && (
                    <div>
                        <p><strong>Username:</strong> {selectedEmployee.username}</p>
                        <p>
                            <strong>Password:</strong> 
                            {isPasswordVisible ? selectedEmployee.password : '********'}
                        </p>
                        <button onClick={togglePasswordVisibility}>
                            {isPasswordVisible ? 'Hide Password' : 'Show Password'}
                        </button>
                    </div>
                )}
                <button onClick={closeModal}>Close</button>
            </ReactModal>
        </div>
    );
};

export default ManageEmployee;