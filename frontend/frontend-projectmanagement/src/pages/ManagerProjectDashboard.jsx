import React, { useState, useEffect } from 'react';
import '../style/ManagerProjectDashboard.css';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function ManagerProjectDashboard() {
  const [employeeId, setEmployeeId] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [progressData, setProgressData] = useState({
    Complete: 0,
    Construct: 0,
    Analyse: 0,
    allProjects: 0,
  });

  const stages = ['Complete', 'Construct', 'Analyse'];

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        const response = await fetch('http://localhost:8081/api/manager/projects/stage-count');
        if (response.ok) {
          const data = await response.json();
          setProgressData({
            Complete: data.Complete || 0,
            Construct: data.Construct || 0,
            Analyse: data.Analyse || 0,
            allProjects: data.allProjects || 0,
          });
        } else {
          console.error('Failed to fetch progress data');
        }
      } catch (error) {
        console.error('Error fetching progress data:', error);
      }
    };

    fetchProgressData();
  }, []);

  const fetchEmployeeName = async (empId) => {
    try {
      const response = await fetch(`http://localhost:8081/api/employee/${empId}`);
      if (response.ok) {
        const data = await response.json();
        setEmployeeName(`${data.firstName} ${data.lastName}`);
      } else {
        console.error('Failed to fetch employee name');
      }
    } catch (error) {
      console.error('Error fetching employee name:', error);
    }
  };

  const fetchProjects = async (supervisorId) => {
    try {
      const response = await fetch(`http://localhost:8081/api/projects/by-supervisor/${supervisorId}`);
      if (response.ok) {
        const data = await response.json();
        setProjects(Array.isArray(data) ? data : []);
      } else {
        console.error('Failed to fetch projects');
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleEmployeeIdChange = async (event) => {
    const empId = event.target.value;
    setEmployeeId(empId);
    await fetchEmployeeName(empId);
    await fetchProjects(empId);
  };

  const ProgressCircle = ({ label, progress, allProjects }) => {
    const percentage = allProjects > 0 ? (progress / allProjects) * 100 : 0;

    return (
      <div className="progress-circle-container">
        <div className="progress-circle">
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="50" stroke="#ddd" strokeWidth="10" fill="none" />
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke="#007BFF"
              strokeWidth="10"
              fill="none"
              strokeDasharray={`${(percentage * Math.PI * 2 * 50) / 100} ${Math.PI * 2 * 50}`}
              strokeDashoffset="0"
              strokeLinecap="round"
            />
          </svg>
          <div className="circle-center">{progress}</div>
        </div>
        <p>{label}</p>
      </div>
    );
  };

  const renderProjectSummary = (project) => {
    const budgetDifference = project.expectedBudget && project.realBudget
      ? (project.expectedBudget - project.realBudget).toFixed(2)
      : null;
    const timeDifference = project.expectedTime && project.endTime
      ? Math.round((new Date(project.endTime) - new Date(project.expectedTime)) / (1000 * 60 * 60 * 24))
      : null;

    return (
      <div className="project-summary">
        <h3>Project: {project.projectName}</h3>
        <p>Status: {project.status}</p>
        <p>Expected Budget: {project.expectedBudget ? `Rs. ${project.expectedBudget.toFixed(2)}` : 'N/A'}</p>
        <p>Real Budget: {project.realBudget ? `Rs. ${project.realBudget.toFixed(2)}` : 'N/A'}</p>
        <p>Budget Difference: {budgetDifference !== null ? (budgetDifference > 0 ? `Save (Rs. ${budgetDifference})` : `Over Budget (Rs. ${Math.abs(budgetDifference)})`) : 'N/A'}</p>
        <p>Expected Time: {project.expectedTime ? new Date(project.expectedTime).toISOString().split('T')[0] : 'N/A'}</p>
        <p>End Time: {project.endTime ? new Date(project.endTime).toISOString().split('T')[0] : 'N/A'}</p>
        <p>Time Difference: {timeDifference !== null ? (timeDifference > 0 ? `Ahead (${timeDifference} days)` : `Behind (${Math.abs(timeDifference)} days)`) : 'N/A'}</p>
        <p>{!project.realBudget || !project.endTime ? 'Still in progress' : ''}</p>
      </div>
    );
  };

  return (
    <div className="project-report-container">
      <div className="progress-circles">
        {stages.map((stage) => (
          <ProgressCircle
            key={stage}
            label={stage}
            progress={progressData[stage] || 0}
            allProjects={progressData.allProjects || 0}
          />
        ))}
      </div>

      <div className="search-section">
        <div className="employee-input">
          <label htmlFor="employeeId">Enter Employee ID:</label>
          <input
            type="text"
            id="employeeId"
            value={employeeId}
            onChange={handleEmployeeIdChange}
            placeholder="Enter Employee ID"
          />
        </div>
        <div className="employee-name">
          <p>Employee Name: {employeeName}</p>
        </div>
      </div>

      <h2 className="project-title">Project Report</h2>

      <div className="tables-layout">
        <div className="project-table-container">
          <table className="project-table">
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Status</th>
                <th>Expected Time</th>
                <th>Expected Budget</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.oProjectId} onClick={() => setSelectedProject(project)}>
                  <td>{project.projectName}</td>
                  <td>{project.status}</td>
                  <td>{project.expectedTime ? new Date(project.expectedTime).toISOString().split('T')[0] : 'N/A'}</td>
                  <td>{project.expectedBudget ? `Rs. ${project.expectedBudget.toFixed(2)}` : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedProject && (
          <div className="project-summary-container">
            {renderProjectSummary(selectedProject)}
          </div>
        )}
      </div>
    </div>
  );
}

export default ManagerProjectDashboard;
