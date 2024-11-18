import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { Link, Routes, Route, useMatch, useResolvedPath } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AdminNavbar } from "../../components/Navbars";

const ManageAllEmployees = () => {
    const [employees, setEmployees] = useState([]);
    const [newEmployee, setNewEmployee] = useState({ firstName: '', lastName: '', position: '', officeID: '' });

    useEffect(() => {
        // Fetch all employees when the component is mounted
        axios.get('/api/get-all-employees')
            .then(response => {
                setEmployees(response.data);
            })
            .catch(error => {
                console.error('Error fetching employees:', error);
            });
    }, []);

    const handleAddEmployee = () => {
        axios.post('/api/add-employee', newEmployee)
            .then(response => {
                setEmployees([...employees, newEmployee]);
                setNewEmployee({ firstName: '', lastName: '', position: '', officeID: '' });
            })
            .catch(error => {
                console.error('Error adding employee:', error);
            });
    };

    const handleRemoveEmployee = (EID) => {
        axios.post('/api/remove-employee', { EID })
            .then(response => {
                setEmployees(employees.filter(employee => employee.EID !== EID));
            })
            .catch(error => {
                console.error('Error removing employee:', error);
            });
    };

    return (
        <div>
            <h1>Manage Employees</h1>
            <div>
                <h2>Add New Employee</h2>
                <input 
                    type="text" 
                    placeholder="First Name" 
                    value={newEmployee.firstName} 
                    onChange={(e) => setNewEmployee({ ...newEmployee, firstName: e.target.value })} 
                />
                <input 
                    type="text" 
                    placeholder="Last Name" 
                    value={newEmployee.lastName} 
                    onChange={(e) => setNewEmployee({ ...newEmployee, lastName: e.target.value })} 
                />
                <input 
                    type="text" 
                    placeholder="Position" 
                    value={newEmployee.position} 
                    onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })} 
                />
                <input 
                    type="number" 
                    placeholder="Office ID" 
                    value={newEmployee.officeID} 
                    onChange={(e) => setNewEmployee({ ...newEmployee, officeID: e.target.value })} 
                />
                <button onClick={handleAddEmployee}>Add Employee</button>
            </div>

            <h2>Employee List</h2>
            <ul>
                {employees.map(employee => (
                    <li key={employee.EID}>
                        {employee.firstName} {employee.lastName} - {employee.position}
                        <button onClick={() => handleRemoveEmployee(employee.EID)}>Remove</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ManageAllEmployees;
