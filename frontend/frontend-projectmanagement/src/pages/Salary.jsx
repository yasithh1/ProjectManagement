import React, { useState, useEffect } from 'react';

function Salary() {
  const [labors, setLabors] = useState([]);
  const [laborDetails, setLaborDetails] = useState({});
  const [paidLabors, setPaidLabors] = useState([]);

  useEffect(() => {
    fetchLaborsWithSignOut();
  }, []);

  const fetchLaborsWithSignOut = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/labor-requests/labors-with-signout');
      if (response.ok) {
        const data = await response.json();
        setLabors(data.filter(labor => !labor.payStatus));
        setPaidLabors(data.filter(labor => labor.payStatus));
        await fetchLaborDetails(data);
      } else {
        console.error('Failed to fetch labors with sign-out');
      }
    } catch (error) {
      console.error('Error fetching labors with sign-out:', error);
    }
  };

  const fetchLaborDetails = async (labors) => {
    const details = {};
    for (const labor of labors) {
      try {
        const response = await fetch(`http://localhost:8081/api2/${labor.laborId}`);
        if (response.ok) {
          const data = await response.json();
          details[labor.laborId] = data;
        } else {
          console.error(`Failed to fetch details for labor ID ${labor.laborId}`);
        }
      } catch (error) {
        console.error(`Error fetching details for labor ID ${labor.laborId}:`, error);
      }
    }
    setLaborDetails(details);
  };

  const calculateCharge = (assignLabors, labor) => {
    if (!labor || !labor.charge) {
      return 0;
    }
    const daysWorked = (new Date(assignLabors.signOutDate) - new Date(assignLabors.date)) / (1000 * 60 * 60 * 24);
    return (daysWorked * labor.charge).toFixed(2); // Round to 2 decimal points
  };

  const updatePayStatus = async (assignId) => {
    try {
      const response = await fetch(`http://localhost:8081/api/labor-requests/update-pay-status/${assignId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        const updatedLabors = labors.map(labor => {
          if (labor.assignId === assignId) {
            const updatedLabor = { ...labor, payStatus: new Date().toISOString().split('T')[0] };
            setPaidLabors([...paidLabors, updatedLabor]);
            return updatedLabor;
          } else {
            return labor;
          }
        });
        setLabors(updatedLabors.filter(labor => !labor.payStatus));
      } else {
        console.error('Failed to update pay status');
      }
    } catch (error) {
      console.error('Error updating pay status:', error);
    }
  };

  return (
    <div>
      <h1>Labors Salary Management</h1>
      <h2>Unpaid Labors</h2>
      <table>
        <thead>
          <tr>
            <th>Labor ID</th>
            <th>Assign ID</th>
            <th>Days Worked</th>
            <th>Total Charge</th>
            <th>Pay Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {labors.map(labor => {
            const laborDetail = laborDetails[labor.laborId] || {};
            return (
              <tr key={labor.assignId}>
                <td>{labor.laborId}</td>
                <td>{labor.assignId}</td>
                <td>{(new Date(labor.signOutDate) - new Date(labor.date)) / (1000 * 60 * 60 * 24)}</td>
                <td>{calculateCharge(labor, laborDetail)}</td>
                <td>{labor.payStatus ? labor.payStatus : 'Not Paid'}</td>
                <td>
                  {!labor.payStatus && <button onClick={() => updatePayStatus(labor.assignId)}>Mark as Paid</button>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <h2>Paid Labors</h2>
      <table>
        <thead>
          <tr>
            <th>Labor ID</th>
            <th>Assign ID</th>
            <th>Days Worked</th>
            <th>Total Charge</th>
            <th>Pay Date</th>
          </tr>
        </thead>
        <tbody>
          {paidLabors.map(labor => {
            const laborDetail = laborDetails[labor.laborId] || {};
            return (
              <tr key={labor.assignId}>
                <td>{labor.laborId}</td>
                <td>{labor.assignId}</td>
                <td>{(new Date(labor.signOutDate) - new Date(labor.date)) / (1000 * 60 * 60 * 24)}</td>
                <td>{calculateCharge(labor, laborDetail)}</td>
                <td>{labor.payStatus}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Salary;
