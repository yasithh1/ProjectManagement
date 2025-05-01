import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../style/ProjectFormPopup.css';

function ProjectFormPopup({ closePopup }) {
  const [projectName, setProjectName] = useState('');
  const [supervisor, setSupervisor] = useState('');
  const [expectedDate, setExpectedDate] = useState('');
  const [expectedBudget, setExpectedBudget] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [existingProjects, setExistingProjects] = useState([]);

  const empId = localStorage.getItem('empId');

  useEffect(() => {
    if (empId) {
      fetchAssignments(empId);
      fetchExistingProjects();
    }
  }, [empId]);

  const fetchAssignments = async (empId) => {
    try {
      const response = await axios.get(`http://localhost:8081/api6/assignments/project/${empId}`);
      const data = Array.isArray(response.data) ? response.data : [response.data];
      setAssignments(data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  const fetchExistingProjects = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/api/projects/projects`);
      const data = Array.isArray(response.data) ? response.data : [response.data];
      setExistingProjects(data.map(project => project.assignProjectId));
    } catch (error) {
      console.error('Error fetching existing projects:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedAssignment) {
      alert('Please select an assignment ID.');
      return;
    }

    if (existingProjects.includes(Number(selectedAssignment))) {
      alert('A project with this assignment ID already exists.');
      return;
    }

    const newProject = {
      oProjectId: Number(selectedAssignment), // Manually set the oProjectId from the selected assignment
      projectName,
      supervisor,
      expectedTime: expectedDate,
      expectedBudget,
      status: 'start',
      assignProjectId: Number(selectedAssignment),
    };

    try {
      const response = await fetch('http://localhost:8081/api/projects/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProject),
      });

      if (response.ok) {
        setProjectName('');
        setSupervisor('');
        setExpectedDate('');
        setExpectedBudget('');
        setSelectedAssignment('');
        closePopup();
        window.location.reload();
      } else {
        console.error('Failed to create project');
      }
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  return (
    <div className="project-form-popup">
      <div className="popup-content">
        <h2>Create Project</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="project-name">Project Name:</label>
            <input
              type="text"
              id="project-name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="supervisor">Supervisor:</label>
            <input
              type="text"
              id="supervisor"
              value={supervisor}
              onChange={(e) => setSupervisor(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="expected-date">Expected Date:</label>
            <input
              type="date"
              id="expected-date"
              value={expectedDate}
              onChange={(e) => setExpectedDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="expected-budget">Expected Budget:</label>
            <input
              type="number"
              id="expected-budget"
              value={expectedBudget}
              onChange={(e) => setExpectedBudget(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="assignment-select">Select Assignment ID:</label>
            <select
              id="assignment-select"
              value={selectedAssignment}
              onChange={(e) => setSelectedAssignment(e.target.value)}
              required
            >
              <option value="" disabled>Select an Assignment</option>
              {assignments.map(assignment => (
                <option key={assignment.assignProjectId} value={assignment.assignProjectId}>
                  {assignment.assignProjectId}
                </option>
              ))}
            </select>
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-btn">Create</button>
            <button type="button" className="cancel-btn" onClick={closePopup}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProjectFormPopup;
