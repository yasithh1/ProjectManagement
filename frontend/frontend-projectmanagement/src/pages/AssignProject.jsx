import React, { useState, useEffect } from 'react';

function AssignProject() {
  const [designs, setDesigns] = useState([]);
  const [engineers, setEngineers] = useState([]);
  const [selectedEngineer, setSelectedEngineer] = useState('');
  const empId = localStorage.getItem('empId');

  useEffect(() => {
    fetchApprovedDesigns();
    fetchEngineers();
  }, []);

  const fetchApprovedDesigns = async () => {
    try {
      const response = await fetch('http://localhost:8081/api7/ongoing/approved');
      if (response.ok) {
        const data = await response.json();
        setDesigns(data);
        console.log('Fetched approved designs:', data);
      } else {
        console.error('Failed to fetch approved designs');
      }
    } catch (error) {
      console.error('Error fetching approved designs:', error);
    }
  };

  const fetchEngineers = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/employee');
      if (response.ok) {
        const data = await response.json();
        const engineers = data.filter((employee) => employee.position === 'engineer');
        setEngineers(engineers);
        console.log('Fetched engineers:', engineers);
      } else {
        console.error('Failed to fetch engineers');
      }
    } catch (error) {
      console.error('Error fetching engineers:', error);
    }
  };

  const handleAssign = async (odesignId) => {
    if (!selectedEngineer) {
      alert('Please select an engineer.');
      return;
    }

    console.log('Assigning design to engineer:', selectedEngineer);

    const formData = new FormData();
    formData.append('projectAssignTo', selectedEngineer);
    formData.append('projectAssignBy', empId);
    formData.append('designId', odesignId);
    formData.append('createdAt', new Date().toISOString());

    const design = designs.find((d) => d.odesignId === odesignId);
    formData.append('design', new Blob([design.design], { type: 'image/jpeg' }));

    try {
      const response = await fetch('http://localhost:8081/api6/assignments/project', {
        method: 'POST',
        body: formData,
      });

      console.log('Response:', response);

      if (response.ok) {
        alert('Project assigned successfully!');
        updateDesignStatus(odesignId);
      } else {
        const errorText = await response.text();
        console.error('Failed to assign project:', response.status, response.statusText, errorText);
      }
    } catch (error) {
      console.error('Error assigning project:', error);
    }
  };

  const updateDesignStatus = async (odesignId) => {
    try {
      const formData = new FormData();
      formData.append('oDesignId', odesignId);
      formData.append('status', 'assigned');

      const response = await fetch('http://localhost:8081/api7/ongoing/upload', {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        console.log('Design status updated to assigned!');
        fetchApprovedDesigns();
      } else {
        const errorText = await response.text();
        console.error('Failed to update design status:', response.status, response.statusText, errorText);
      }
    } catch (error) {
      console.error('Error updating design status:', error);
    }
  };

  return (
    <div>
      <h2>Assign Project</h2>
      <div>
        <label>
          Select Engineer:
          <select value={selectedEngineer} onChange={(e) => setSelectedEngineer(e.target.value)}>
            <option value="">Select an engineer</option>
            {engineers.map((engineer) => (
              <option key={engineer.empId} value={engineer.empId}>
                {engineer.firstName} {engineer.lastName}
              </option>
            ))}
          </select>
        </label>
      </div>

      <h3>Approved Designs</h3>
      <table>
        <thead>
          <tr>
            <th>Design ID</th>
            <th>Design Name</th>
            <th>Design Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {designs.map((design) => (
            <tr key={design.odesignId}>
              <td>{design.odesignId}</td>
              <td>{design.designName}</td>
              <td>{design.designType}</td>
              <td>
                <button onClick={() => handleAssign(design.odesignId)}>Assign</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AssignProject;
