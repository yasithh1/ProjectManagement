import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../style/RequestForm.css';

const SendProcurementRequests = () => {
  const [projectId, setProjectId] = useState('');
  const [vendorTypes, setVendorTypes] = useState([{ vendorType: '', quantity: '' }]); // Ensure the field names match
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const empId = localStorage.getItem('empId'); // Get empId from local storage
    axios.get(`http://localhost:8081/api/projects/by-supervisor/${empId}`)
      .then(response => {
        setProjects(response.data);
      })
      .catch(error => {
        console.error('Error fetching projects:', error);
      });
  }, []);

  const handleAddVendor = () => {
    setVendorTypes([...vendorTypes, { vendorType: '', quantity: '' }]); // Ensure the field names match
  };

  const handleVendorChange = (index, event) => {
    const { name, value } = event.target;
    const newVendorTypes = vendorTypes.map((vendor, idx) => {
      if (index === idx) {
        return { ...vendor, [name]: value };
      }
      return vendor;
    });
    setVendorTypes(newVendorTypes);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const empId = localStorage.getItem('empId');
    const requestData = {
      projectId: parseInt(projectId, 10), // Ensure projectId is parsed as an integer
      receiver: empId,
      vendors: vendorTypes
    };
    axios.post('http://localhost:8081/api/vendor-requests/request', requestData)
      .then(response => {
        console.log('Request created successfully:', response.data);
        // Reset the form fields
        setProjectId('');
        setVendorTypes([{ vendorType: '', quantity: '' }]); // Ensure the field names match
      })
      .catch(error => {
        console.error('Error creating request:', error);
      });
  };

  return (
    <div className="request-form">
      <h2>Create Vendor Request</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="projectId">Project ID</label>
          <select id="projectId" value={projectId} onChange={(e) => setProjectId(e.target.value)} required>
            <option value="">Select a project</option>
            {projects.map((project, index) => (
              <option key={index} value={project.oprojectId}>{project.oprojectId}</option>
            ))}
          </select>
        </div>
        {vendorTypes.map((vendor, index) => (
          <div key={index} className="form-group">
            <label htmlFor={`vendorType${index}`}>Vendor Type</label>
            <input
              type="text"
              id={`vendorType${index}`}
              name="vendorType" // Ensure the field name matches
              value={vendor.vendorType}
              onChange={(event) => handleVendorChange(index, event)}
              required
            />
            <label htmlFor={`vendorQuantity${index}`}>Quantity</label>
            <input
              type="number"
              id={`vendorQuantity${index}`}
              name="quantity"
              value={vendor.quantity}
              onChange={(event) => handleVendorChange(index, event)}
              required
            />
          </div>
        ))}
        <button type="button" onClick={handleAddVendor}>Add Another Vendor</button>
        <button type="submit">Submit Request</button>
      </form>
    </div>
  );
};

export default SendProcurementRequests;
