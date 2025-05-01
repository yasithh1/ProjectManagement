import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../style/Assigments.css';

function Assigments() {
  const [assignments, setAssignments] = useState([]);
  const [contractDetails, setContractDetails] = useState({});
  const [employeeDetails, setEmployeeDetails] = useState({});
  const empId = localStorage.getItem('empId'); // Assuming empId is stored in local storage

  // Fetch assignments by employee ID
  const fetchAssignments = async (assignTo) => {
    try {
      const response = await axios.get(`http://localhost:8081/api6/assignments/designs/${assignTo}`);
      console.log('Assignments Response:', response.data); // Debug log
      setAssignments(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching assignments", error);
    }
  };

  // Fetch contract details by contract ID
  const fetchContractDetails = async (contractId) => {
    try {
      const response = await axios.get(`http://localhost:8081/api4/${contractId}`);
      console.log(`Contract Details for ${contractId}:`, response.data); // Debug log
      setContractDetails(prevState => ({ ...prevState, [contractId]: response.data }));
    } catch (error) {
      console.error("Error fetching contract details", error);
    }
  };

  // Fetch employee details by employee ID
  const fetchEmployeeDetails = async (empId) => {
    try {
      const response = await axios.get(`http://localhost:8081/api/${empId}`);
      console.log(`Employee Details for ${empId}:`, response.data); // Debug log
      setEmployeeDetails(prevState => ({ ...prevState, [empId]: response.data }));
    } catch (error) {
      console.error("Error fetching employee details", error);
    }
  };

  useEffect(() => {
    if (empId) {
      console.log('Fetching assignments for:', empId); // Debug log
      fetchAssignments(empId);
    }
  }, [empId]);

  useEffect(() => {
    if (Array.isArray(assignments) && assignments.length > 0) {
      console.log('Assignments state updated:', assignments); // Debug log
      assignments.forEach(assignment => {
        fetchContractDetails(assignment.contractId);
        fetchEmployeeDetails(assignment.assignBy);
      });
    }
  }, [assignments]);

  useEffect(() => {
    console.log('Contract Details State:', contractDetails); // Debug log
  }, [contractDetails]);

  useEffect(() => {
    console.log('Employee Details State:', employeeDetails); // Debug log
  }, [employeeDetails]);

  return (
    <div className="assignments-container">
      <h2 className="assignments-title">Design Assignments</h2>
      <div className="assignments-list">
        {Array.isArray(assignments) && assignments.length > 0 ? (
          assignments.map(assignment => (
            <div key={assignment.assignId} className="assignment-item">
              <h3 className="assignment-title">Design ID: {assignment.assignId}</h3>
              <p className="assignment-detail">Assigned By: {employeeDetails[assignment.assignBy]?.firstName} {employeeDetails[assignment.assignBy]?.lastName}</p>
              <p className="assignment-detail">Contract ID: {assignment.contractId}</p>
              <p className="assignment-detail">Created At: {new Date(assignment.createdAt).toLocaleDateString()}</p>
              {contractDetails[assignment.contractId] && (
                <>
                  <p className="assignment-detail">Date: {new Date(contractDetails[assignment.contractId].date).toLocaleDateString()}</p>
                  <p className="assignment-detail">Details: {contractDetails[assignment.contractId].details}</p>
                  <p className="assignment-detail">Contract Type: {contractDetails[assignment.contractId].contractType}</p>
                  <p className="assignment-detail">Location ID: {contractDetails[assignment.contractId].locationId}</p>
                </>
              )}
            </div>
          ))
        ) : (
          <p>No assignments found.</p>
        )}
      </div>
    </div>
  );
}

export default Assigments;
