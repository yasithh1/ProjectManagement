import React, { useState, useEffect } from 'react';
import '../style/Contracts.css';
import { toast } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

function Contracts() {
  const [contractType, setContractType] = useState('');
  const [description, setDescription] = useState('');
  const [locationType, setLocationType] = useState('proposal');
  const [locations, setLocations] = useState([]);
  const [outlets, setOutlets] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [contracts, setContracts] = useState([]); // State to hold contract data

  useEffect(() => {
    setLoading(true);
    const fetchUrl = locationType === 'proposal' 
      ? 'http://localhost:8081/api3/propose' 
      : 'http://localhost:8081/api3/outlet';

    fetch(fetchUrl)
      .then(response => {
        if (!response.ok) throw new Error(`Failed to fetch ${locationType} data`);
        return response.json();
      })
      .then(data => {
        if (locationType === 'proposal') {
          const approvedLocations = data.filter(proposal => proposal.rejectApprove === 'approve');
          setLocations(approvedLocations);
        } else {
          setOutlets(data);
        }
      })
      .catch(error => console.error(`Error fetching ${locationType} data:`, error))
      .finally(() => setLoading(false));
  }, [locationType]);

  // Fetch contract data
  useEffect(() => {
    const fetchContracts = async () => {
      setLoading(true); 
      try {
        const response = await fetch('http://localhost:8081/api4/contract');
        if (response.ok) {
          const data = await response.json();
          setContracts(data); 
        } else {
          console.error('Failed to fetch contracts');
        }
      } catch (error) {
        console.error('Error fetching contracts:', error);
      } finally {
        setLoading(false); 
      }
    };

    fetchContracts();
  }, []);

  // Handle contract cancellation or status update
  const handleStatusChange = async (contractId, status) => {
    if (status === 'assigned') {
      toast.error('This contract cannot be canceled because its status is "assigned".');
      return;
    }
  
    try {
      // Send 'status' as a query parameter, not in the request body
      const response = await fetch(`http://localhost:8081/api4/${contractId}/status?status=canceled`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const responseText = await response.text(); 
  
      if (!response.ok) {
        toast.error(`Failed to update contract status: ${responseText}`);
        return;
      }
  
      toast.success(responseText); // Display success message
  
      // Update the contract status in the UI
      setContracts(contracts.map(c =>
        c.contractId === contractId ? { ...c, status: 'canceled' } : c
      ));
  
    } catch (error) {
      console.error('Error updating contract status:', error);
      toast.error('An unexpected error occurred. Please try again.');
    }
  };
  
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedLocation) {
      toast.error('Please select a location.');
      return;
    }

    const contractData = {
      contractType,
      details: description,
      locationId: selectedLocation,
      date: new Date().toISOString().split('T')[0],
    };

    try {
      const response = await fetch('http://localhost:8081/api4/contract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contractData),
      });

      if (response.ok) {
        toast.success('Contract successfully created!');
        setContractType('');
        setDescription('');
        setSelectedLocation('');
        setLocationType('proposal');
      } else {
        const errorData = await response.text();
        toast.error(`Failed to create contract: ${errorData}`);
      }
    } catch (error) {
      console.error('Error submitting contract:', error);
      toast.error('An unexpected error occurred. Please try again.');
    }
    console.log("Sending contract data:", contractData);
  };

  return (
    <div className="contract-form-container">
      <h2>Create a Contract</h2>
      <form onSubmit={handleSubmit} className="contract-form">
        {/* Contract Type */}
        <div className="form-group">
          <label htmlFor="contractType">Contract Type</label>
          <select
            id="contractType"
            value={contractType}
            onChange={(e) => setContractType(e.target.value)}
            required
          >
            <option value="">Select Contract Type</option>
            <option value="maintenance">Maintenance</option>
            <option value="new-outlet">New Outlet</option>
          </select>
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        {/* Location Type */}
        <div className="form-group">
          <label htmlFor="locationType">Select Location Type</label>
          <select
            id="locationType"
            value={locationType}
            onChange={(e) => setLocationType(e.target.value)}
            required
          >
            <option value="proposal">Proposal</option>
            <option value="outlet">Outlet</option>
          </select>
        </div>

        {/* Location Selection */}
        <div className="form-group">
          <label htmlFor="location">Select Location</label>
          <select
            id="location"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            required
          >
            <option value="">Select a Location</option>
            {loading ? (
              <option>Loading...</option>
            ) : (
              locationType === 'proposal'
                ? locations.map(proposal => (
                    <option key={proposal.proposeId} value={proposal.location.locationId}>
                      {proposal.location.district}, {proposal.location.province}
                    </option>
                  ))
                : outlets.map(outlet => (
                    <option key={outlet.id} value={outlet.location.locationId}>
                      {outlet.outletname}
                    </option>
                  ))
            )}
          </select>
        </div>

        <button type="submit" className="submit-btn">Submit Contract</button>
      </form>

      {/* Contracts Table */}
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
              <th>Action</th> {/* Added column for action buttons */}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7">Loading...</td>
              </tr>
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
                    {contract.status === 'assigned' ? (
                      <button disabled>Cannot Cancel</button> // Disable button if status is "assigned"
                    ) : (
                      <button onClick={() => handleStatusChange(contract.contractId, contract.status)}>
                        Cancel Contract
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Contracts;
