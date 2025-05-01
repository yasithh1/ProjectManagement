import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../style/SuppervisorProjects.css';

function SupervisorProjects() {
  const [supervisor, setSupervisor] = useState('');
  const [projects, setProjects] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/api/projects/by-supervisor/${supervisor}`);
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching supervisor projects:', error);
      setErrorMessage('Failed to fetch projects.');
    }
  };

  return (
    <div className="supervisor-projects-container">
      <h2>Supervisor Projects</h2>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter Supervisor"
          value={supervisor}
          onChange={(e) => setSupervisor(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {projects.map((project) => {
        const savings = project.expectedBudget - project.realBudget;
        const savingsPercentage = ((savings / project.expectedBudget) * 100).toFixed(2);

        return (
          <div key={project.oProjectId} className="project-card">
            <h3>{project.projectName} (ID: {project.oProjectId})</h3>
            <p><strong>Supervisor:</strong> {project.supervisor}</p>
            <p><strong>Real Budget:</strong> {project.realBudget}</p>
            <p><strong>Expected Budget:</strong> {project.expectedBudget}</p>
            <p><strong>Expected Time:</strong> {new Date(project.expectedTime).toDateString()}</p>
            <p><strong>End Time:</strong> {project.endTime ? new Date(project.endTime).toDateString() : 'N/A'}</p>
            <p><strong>Savings:</strong> {savings}</p>
            <p><strong>Savings Percentage:</strong> {savingsPercentage}%</p>
          </div>
        );
      })}
    </div>
  );
}

export default SupervisorProjects;
