import React, { useState, useEffect } from 'react';

function ManageComplains() {
  const [complains, setComplains] = useState([]);
  const [resolvedComplains, setResolvedComplains] = useState([]);
  const empId = localStorage.getItem('empId');

  const fetchComplains = async () => {
    try {
      const response = await fetch('http://localhost:8081/api8/complain');
      if (response.ok) {
        const data = await response.json();
        const unresolved = data.filter(complain => complain.status !== 'resolved');
        const resolved = data.filter(complain => complain.status === 'resolved');
        setComplains(unresolved);
        setResolvedComplains(resolved);
        console.log('Fetched complains:', data);
      } else {
        console.error('Failed to fetch complains');
      }
    } catch (error) {
      console.error('Error fetching complains:', error);
    }
  };

  useEffect(() => {
    fetchComplains();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    console.log('Updating status for complainId:', id);

    const formData = new FormData();
    formData.append('status', status);
    formData.append('viewer', empId);

    console.log('Form data:', formData);

    try {
      const response = await fetch(`http://localhost:8081/api8/update-status/${id}`, {
        method: 'PUT',
        body: formData,
      });

      console.log('Response:', response);

      if (response.ok) {
        fetchComplains();
        alert(`Complain status updated to ${status}!`);
      } else {
        const errorText = await response.text();
        console.error('Failed to update status:', response.status, response.statusText, errorText);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div>
      <h2>Manage Complains</h2>
      
      <h3>All Complains</h3>
      <table>
        <thead>
          <tr>
            <th>Complain ID</th>
            <th>Complain Description</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {complains.map((complain) => (
            <tr key={complain.complainId}>
              <td>{complain.complainId}</td>
              <td>{complain.reason}</td>
              <td>{complain.status}</td>
              <td>
                <button onClick={() => handleUpdateStatus(complain.complainId, 'resolved')}>Resolve</button>
                <button onClick={() => handleUpdateStatus(complain.complainId, 'pending')}>Pending</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Resolved Complains</h3>
      <table>
        <thead>
          <tr>
            <th>Complain ID</th>
            <th>Complain Description</th>
            <th>Status</th>
            <th>Viewer</th>
          </tr>
        </thead>
        <tbody>
          {resolvedComplains.map((complain) => (
            <tr key={complain.complainId}>
              <td>{complain.complainId}</td>
              <td>{complain.reason}</td>
              <td>{complain.status}</td>
              <td>{complain.viewer}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageComplains;
