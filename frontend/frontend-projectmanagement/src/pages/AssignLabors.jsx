import React, { useState, useEffect } from 'react';

function AssignLabors() {
  const [labors, setLabors] = useState([]);
  const [requestId, setRequestId] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (requestId) {
      fetchLaborsByRequestId(requestId);
    }
  }, [requestId]);

  const fetchLaborsByRequestId = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:8081/api/labor-requests/by-request?requestId=${requestId}`);
      if (response.ok) {
        const data = await response.json();
        setLabors(data);
      } else {
        console.error('Failed to fetch labors');
      }
    } catch (error) {
      console.error('Error fetching labors:', error);
    }
  };

  const signOutLabor = async (inputId) => {
    try {
      const response = await fetch(`http://localhost:8081/api/labor-requests/update-sign-out-date/${inputId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentDate),
      });
      if (response.ok) {
        setLabors(labors.map(labor => {
          if (labor.assignId === inputId) {
            return { ...labor, signOutDate: currentDate };
          } else {
            return labor;
          }
        }));
      } else {
        console.error('Failed to update sign-out date');
      }
    } catch (error) {
      console.error('Error updating sign-out date:', error);
    }
  };

  const signOutAllLabors = async () => {
    try {
      for (const labor of labors) {
        await signOutLabor(labor.assignId);
      }
    } catch (error) {
      console.error('Error signing out all labors:', error);
    }
  };

  return (
    <div>
      <h1>Assigned Labors</h1>
      <label>
        Request ID:
        <input
          type="number"
          value={requestId}
          onChange={(e) => setRequestId(e.target.value)}
          placeholder="Enter request ID"
        />
      </label>
      <table>
        <thead>
          <tr>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {labors.map(labor => (
            <tr key={labor.assignId}>
              <td>
                { !labor.signOutDate && <button onClick={() => signOutLabor(labor.assignId)}>Sign Out</button> }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {labors.some(labor => !labor.signOutDate) && <button onClick={signOutAllLabors}>Sign Out All</button>}
    </div>
  );
}

export default AssignLabors;
