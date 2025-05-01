import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useEnterSubmit from '../hooks/useEnterSubmit';
import '../style/Complains.css';

function Complains() {
  const [reason, setReason] = useState('');
  const [complains, setComplains] = useState([]);
  const [error, setError] = useState(null);
  const empId = localStorage.getItem('empId'); // Assuming empId is stored in local storage

  // Handle form submit to create a new complain
  const handleSubmit = async () => {
    const newComplain = {
      reason,
      complainer: empId,
      status: 'Pending',
    };

    try {
      await axios.post('http://localhost:8081/api8/complain', newComplain);
      fetchComplainsByComplainer(empId); // Refresh the complains list after adding
      setReason('');
    } catch (error) {
      setError("Error submitting complain. Please try again.");
    }
  };

  useEnterSubmit(handleSubmit);

  // Fetch complains by complainer
  const fetchComplainsByComplainer = async (complainer) => {
    try {
      const response = await axios.get(`http://localhost:8081/api8/complain/${complainer}`);
      setComplains(response.data);
    } catch (error) {
      setError("Error fetching complains. Please try again.");
    }
  };

  // Fetch complains by the current user when component mounts
  useEffect(() => {
    if (empId) {
      fetchComplainsByComplainer(empId);
    }
  }, [empId]);

  return (
    <div className="complains-container">
      <h2 className="complains-title">Submit a Complain</h2>
      <form onSubmit={(e) => e.preventDefault()} className="complains-form">
        <label htmlFor="reason" className="complains-label">Reason</label>
        <textarea
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
          className="complains-textarea"
        ></textarea>

        <button type="button" onClick={handleSubmit} className="complains-button">Submit</button>
        {error && <p className="complains-error">{error}</p>}
      </form>

      <div className="complains-divider"></div>

      <h2 className="complains-title">My Complains</h2>
      <div className="complains-list">
        {complains.sort((a, b) => a.status === 'Get Action' ? -1 : 1).map((complain) => (
          <div key={complain.complainId} className={`complains-item ${complain.status === 'Get Action' ? 'complains-item-action' : ''}`}>
            <h3 className="complains-item-title">Reason: {complain.reason}</h3>
            <p className="complains-item-detail">Status: {complain.status}</p>
            <p className="complains-item-detail">Viewer: {complain.viewer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Complains;
