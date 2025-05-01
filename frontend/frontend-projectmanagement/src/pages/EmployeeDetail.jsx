import React, { useState, useEffect } from "react";
import Header from "../component/AdminHeader";
import "../style/EmployeeDetail.css";

const EmployeeDetail = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [error, setError] = useState(null);

  // Fetch employees from the backend
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/employees");
        if (!response.ok) {
          throw new Error("Failed to fetch employee data");
        }
        const data = await response.json();
        setEmployees(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchEmployees();
  }, []);

  const handleLogout = () => {
    console.log("User logged out");
    window.location.href = "/admin"; // Adjust the path as needed
  };

  const handleClick = (employee) => {
    setSelectedEmployee(employee);
  };

  return (
    <div className="emp-detail">
      <Header onLogout={handleLogout} />
      <div className="container">
        <h1>Employee Details</h1>
        {error && <p className="error">{error}</p>}
        <div className="employeeList">
          <div className="employeeHeader">
            <div>Emp ID</div>
            <div>Name</div>
            <div>Position</div>
          </div>
          {employees.length > 0 ? (
            employees.map((employee, index) => (
              <div
                key={index}
                className="employeeData"
                onClick={() => handleClick(employee)}
              >
                <div>{employee.empid}</div>
                <div>{employee.fullname}</div>
                <div>{employee.position}</div>
              </div>
            ))
          ) : (
            <p>No employees found</p>
          )}
        </div>
        {selectedEmployee && (
          <div className="modal" onClick={() => setSelectedEmployee(null)}>
            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside
            >
              <h2>Employee Details</h2>
              <p>
                <strong>ID:</strong> {selectedEmployee.empid}
              </p>
              <p>
                <strong>Name:</strong> {selectedEmployee.fullname}
              </p>
              <p>
                <strong>Position:</strong> {selectedEmployee.position}
              </p>
              <button onClick={() => setSelectedEmployee(null)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDetail;
