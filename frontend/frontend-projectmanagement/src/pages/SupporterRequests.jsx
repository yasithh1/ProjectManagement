import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../style/SupporterRequests.css';

function SupporterRequests() {
  const [supporterRequests, setSupporterRequests] = useState([]);
  const empId = localStorage.getItem('empId');

  const fetchSupporterRequests = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/api/supporters/by-request-to/${empId}`);
      setSupporterRequests(response.data);
    } catch (error) {
      console.error('Error fetching supporter requests:', error);
    }
  };

  const handleAction = async (supporterId, action) => {
    try {
      const status = action === 'accept' ? 'Accepted' : 'Declined';
      await axios.put(`http://localhost:8081/api/supporters/update-status/${supporterId}`, null, { params: { status } });
      fetchSupporterRequests(); // Refresh the list after action
    } catch (error) {
      console.error(`Error updating status for supporter ${supporterId}:`, error);
    }
  };

  useEffect(() => {
    fetchSupporterRequests();
  }, []);

  return (
    <div className="supporter-requests-container">
      <h2>Supporter Requests</h2>
      <div className="requests-list">
        {supporterRequests.length > 0 ? (
          supporterRequests.map(request => (
            <div key={request.supporterId} className="request-item">
              <h3>Supporter ID: {request.supporterId}</h3>
              <p>Assigned Project ID: {request.ProjectId}</p>
              <p>Requested By: {request.requestBy}</p>
              <p>Status: {request.status}</p>
              <div className="actions">
                <button onClick={() => handleAction(request.supporterId, 'accept')} className="accept-btn">Accept</button>
                <button onClick={() => handleAction(request.supporterId, 'decline')} className="decline-btn">Decline</button>
              </div>
            </div>
          ))
        ) : (
          <p>No supporter requests found.</p>
        )}
      </div>
    </div>
  );
}

export default SupporterRequests;
