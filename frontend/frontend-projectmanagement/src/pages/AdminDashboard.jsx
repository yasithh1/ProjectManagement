import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/AdminHeader";
import "../style/AdminDashboard.css";
import axios from "axios";

const AdminDashboard = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    phoneNumber: "",
    position: ""
  });
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleTileClick = () => {
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedEmployee(null);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      address: "",
      phoneNumber: "",
      position: ""
    });
  };

  const handleLogout = () => {
    console.log("User logged out");
    window.location.href = "/admin";
  };

  const handleEmployeeTileClick = async () => {
    console.log("Employee Details");
    try {
      const response = await axios.get("http://localhost:8081/api/employee");
      if (response.status === 200) {
        setEmployees(response.data);
      } else {
        setErrorMessage("Failed to fetch employees");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Error fetching employee data");
    }
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setFormData({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      address: employee.address,
      phoneNumber: employee.phoneNumber,
      position: employee.position
    });
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log("Form submitted");

    try {
      let response;
      if (selectedEmployee) {
        // Update employee
        response = await axios.put(`http://localhost:8081/api/employee/${selectedEmployee.empId}/update-details`, formData);
      } else {
        // Create new employee
        response = await axios.post("http://localhost:8081/api/employee", formData);
      }

      if (response.status === 200) {
        console.log("Employee added/updated successfully");
        handleCloseForm(); // Close form after successful submission
        handleEmployeeTileClick(); // Refresh employee list
      } else {
        setErrorMessage("Failed to add/update employee");
      }
    } catch (error) {
      console.error("Error adding/updating employee:", error);
      setErrorMessage("Error connecting to server");
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  useEffect(() => {
    handleEmployeeTileClick(); // Fetch employees on component mount
  }, []);

  return (
    <div className="admin-dashboard">
      <Header onLogout={handleLogout} />

      <main className="dashboard-main">
        <div className="tile" id="add-employee" onClick={handleTileClick}>
          <h2>{selectedEmployee ? "Edit Employee" : "Add Employee"}</h2>
        </div>
        <div className="tile" id="empDetails" onClick={handleEmployeeTileClick}>
          <h2>Employee Details</h2>
        </div>
      </main>

      {/* Add Employee Form */}
      {isFormOpen && (
        <div className="form-popup">
          <div className="form-container">
            <h2>{selectedEmployee ? "Edit Employee Form" : "Add Employee Form"}</h2>
            <form onSubmit={handleFormSubmit}>
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />

              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />

              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />

              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />

              <label htmlFor="phoneNumber">Contact No</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
              />

              <label htmlFor="position">Position</label>
              <select
                id="position"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>
                  Select a position
                </option>
                <option value="designer">Designer</option>
                <option value="engineer">Engineer</option>
                <option value="designManager">Design Manager</option>
                <option value="projectManager">Project Manager</option>
                <option value="admin">Admin</option>
                <option value="procurementManager">Procurement Manager</option>
                <option value="propertyTeam">Property Team</option>
                <option value="propertyManager">Property Manager</option>
                <option value="lawyer">Lawyer</option>
          
              </select>

              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  Submit
                </button>
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="close-btn"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Employee Details Table */}
      {employees.length > 0 && (
        <div className="employee-details">
          <h2>Employee List</h2>
          <table>
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Position</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.empId}>
                  <td>{employee.firstName}</td>
                  <td>{employee.lastName}</td>
                  <td>{employee.email}</td>
                  <td>{employee.position}</td>
                  <td>
                    <button onClick={() => handleEditEmployee(employee)}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
