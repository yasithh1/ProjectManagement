import React, { useState, useEffect } from 'react';
import '../style/AssignContracts.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AssignContracts() {
  const [contracts, setContracts] = useState([]);
  const [designers, setDesigners] = useState([]);
  const [selectedContract, setSelectedContract] = useState(null);
  const [selectedDesigner, setSelectedDesigner] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const assignBy = localStorage.getItem('empId'); // Fetch the assigner ID from localStorage

  // Fetch contracts
  useEffect(() => {
    const fetchContracts = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8081/api4/contract');
        const data = await response.json();
        setContracts(data);
      } catch (error) {
        toast.error('Failed to load contracts.');
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, []);

  // Fetch designers
  useEffect(() => {
    const fetchDesigners = async () => {
      try {
        const response = await fetch('http://localhost:8081/api/employee');
        const data = await response.json();
        setDesigners(data.filter(emp => emp.position === 'designer'));
      } catch (error) {
        toast.error('Failed to load designers.');
      }
    };

    fetchDesigners();
  }, []);

  // Handle form submission for assigning designer
  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    if (!selectedDesigner) {
      toast.error('Please select a designer.');
      return;
    }
  
    const selectedDesignerData = designers.find(designer => designer.firstName === selectedDesigner);
    
    // Get the current date and format it
    const createdAt = new Date().toISOString();  // Current date in ISO format
    
    console.log("Selected Designer Data:", selectedDesignerData);
    console.log("Assign By (empId):", assignBy);
  
    // Prepare the request payload with the required format
    const requestPayload = {
      contractId: selectedContract.contractId,  // contractId is an integer
      assignTo: selectedDesignerData.empId.toString(),  // assignTo is a string
      assignBy: assignBy.toString(),  // assignBy is a string
      createdAt: createdAt,  // Add the current date here
    };
    console.log("POST Request Payload:", JSON.stringify(requestPayload));
  
    try {
      // Update the contract status to "assigned"
      const statusResponse = await fetch(`http://localhost:8081/api4/${selectedContract.contractId}/status?status=assigned`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (!statusResponse.ok) {
        toast.error('Failed to update contract status.');
        return;
      }
  
      // Send designer assignment data to the backend
      const assignmentResponse = await fetch('http://localhost:8081/api6/assignments/design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload),
      });
  
      if (!assignmentResponse.ok) {
        toast.error('Failed to assign designer.');
        return;
      }
  
      toast.success(`Contract successfully assigned to ${selectedDesigner}`);
      setShowForm(false);
  
      // Update UI
      setContracts(contracts.map(c =>
        c.contractId === selectedContract.contractId ? { ...c, status: 'assigned', designer: selectedDesigner } : c
      ));
    } catch (error) {
      console.error("Error:", error);
      toast.error('An error occurred while assigning the contract.');
    }
  };
  
  // Handle the "Assign" button click
  const handleAssignClick = (contract) => {
    if (contract.status === 'canceled') {
      toast.error('Cannot assign a canceled contract.');
      return;
    }

    if (contract.status) {
      toast.error('This contract has already been assigned.');
      return;
    }

    setSelectedContract(contract);
    setShowForm(true);
  };

  return (
    <div className="contracts-table-container">
      <table>
        <thead>
          <tr>
            <th>Contract ID</th>
            <th>Date</th>
            <th>Details</th>
            <th>Contract Type</th>
            <th>Location ID</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan="7">Loading...</td></tr>
          ) : (
            contracts.map(contract => (
              <tr key={contract.contractId}>
                <td>{contract.contractId}</td>
                <td>{new Date(contract.date).toLocaleString()}</td>
                <td>{contract.details}</td>
                <td>{contract.contractType}</td>
                <td>{contract.locationId}</td>
                <td>{contract.status || 'N/A'}</td>
                <td>
                  {contract.status ? (
                    <button disabled>{contract.status}</button>
                  ) : (
                    <button onClick={() => handleAssignClick(contract)}>Assign Contract</button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showForm && selectedContract && (
        <div className="assign-form">
          <h3>Assign Contract</h3>
          <p><strong>Contract ID:</strong> {selectedContract.contractId}</p>
          <p><strong>Details:</strong> {selectedContract.details}</p>
          <p><strong>Contract Type:</strong> {selectedContract.contractType}</p>
          
          <form onSubmit={handleFormSubmit}>
            <label>Designer:</label>
            <select value={selectedDesigner} onChange={(e) => setSelectedDesigner(e.target.value)}>
              <option value="">Select a designer</option>
              {designers.map(designer => (
                <option key={designer.empId} value={designer.firstName}>
                  {designer.firstName}
                </option>
              ))}
            </select>
            <div className="form-buttons">
              <button type="submit">Assign</button>
              <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default AssignContracts;
