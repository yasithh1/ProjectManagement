import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../style/AssignSupporters.css';

function AssignSupporters() {
  const [projects, setProjects] = useState([]);
  const [engineers, setEngineers] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedEngineer, setSelectedEngineer] = useState('');
  const empId = localStorage.getItem('empId');

  // Fetch projects assigned to empId
  const fetchProjects = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/api6/assignments/project/${empId}`);
      setProjects(Array.isArray(response.data) ? response.data : [response.data]);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  // Fetch employees with position "Engineer"
  const fetchEngineers = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/employee');
      const engineers = response.data.filter(employee => employee.position === 'engineer');
      setEngineers(engineers);
    } catch (error) {
      console.error('Error fetching engineers:', error);
    }
  };

  // Create a supporter request
  const handleCreateSupporter = async () => {
    if (!selectedProject || !selectedEngineer) {
      alert('Please select both a project and an engineer');
      return;
    }

    const supporter = {
      projectId: selectedProject, // Ensure this key matches the backend expectation
      requestBy: empId,
      requestTo: selectedEngineer,
      status: 'Pending',
    };

    try {
      await axios.post('http://localhost:8081/api/supporters/create-supporter', supporter);
      alert('Supporter request created successfully');
    } catch (error) {
      console.error('Error creating supporter request:', error);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchEngineers();
  }, []);

  return (
    <div className="assign-supporters-container">
      <h2>Assign Supporter</h2>
      <div className="form-group">
        <label htmlFor="project-select">Select Project:</label>
        <select id="project-select" value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}>
          <option value="">Select a Project</option>
          {projects.map(project => (
            <option key={project.assignProjectId} value={project.assignProjectId}>
              {project.assignProjectId}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="engineer-select">Select Engineer:</label>
        <select id="engineer-select" value={selectedEngineer} onChange={(e) => setSelectedEngineer(e.target.value)}>
          <option value="">Select an Engineer</option>
          {engineers.map(engineer => (
            <option key={engineer.empId} value={engineer.empId}>
              {engineer.firstName} {engineer.lastName}
            </option>
          ))}
        </select>
      </div>
      <button onClick={handleCreateSupporter} className="submit-btn">Create Supporter Request</button>
    </div>
  );
}

export default AssignSupporters;
