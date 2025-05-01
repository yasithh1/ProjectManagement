import React, { useState, useEffect } from 'react';
import '../style/ProjectDashboard.css';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import ProjectFormPopup from '../components/ProjectFormPopup';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function ProjectDashboard() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [uploadVisible, setUploadVisible] = useState(false);
  const [realBudget, setRealBudget] = useState('');
  const [vendorInvoice, setVendorInvoice] = useState(null);
  const [supplierInvoice, setSupplierInvoice] = useState(null);
  const [appendices, setAppendices] = useState(null);
  const [progressData, setProgressData] = useState({
    Analyse: 0,
    Construct: 0,
    Hold: 0,
    Complete: 0,
    allProjects: 0,
  });

  const empId = localStorage.getItem('empId');
  const updateTaskUrl = 'http://localhost:8081/api/projects/task';
  const uploadUrl = 'http://localhost:8081/api/projects/upload';
  const stages = ['Analyse', 'Construct', 'Complete', 'Hold'];

  // Fetch all projects for the supervisor
  useEffect(() => {
    if (!empId) return;

    const fetchProjects = async () => {
      try {
        const response = await fetch(
          `http://localhost:8081/api/projects/by-supervisor/${empId}`
        );
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

    fetchProjects();
  }, [empId]);

  // Fetch project stage progress
  useEffect(() => {
    if (!empId) return;

    const fetchProgressData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8081/api/projects/stages-count/${empId}`
        );
        if (response.ok) {
          const data = await response.json();
          setProgressData({
            Analyse: data.Analyse || 0,
            Construct: data.Construct || 0,
            Hold: data.Hold || 0,
            Complete: data.Complete || 0,
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
  }, [empId]);

  // Fetch tasks for a selected project
  const fetchTasksForProject = async (projectId) => {
    try {
      const response = await fetch(
        `http://localhost:8081/api/projects/${projectId}/tasks`
      );
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else {
        console.error('Failed to fetch tasks');
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleRowClick = (project) => {
    console.log(project);  // Check if project has oProjectId
    setSelectedProject(project);
    if (project.oprojectId) {
      fetchTasksForProject(project.oprojectId);
    } else {
      console.error('Project ID is missing');
    }
  };

  // Update task status
  const handleTaskStatusChange = async (taskId, stage, isChecked) => {
    if (!isChecked) return; // Skip if the checkbox is being unchecked
  
    const stageIndex = stages.indexOf(stage);
    const previousStage = stages[stageIndex - 1];
  
    // Ensure that the previous stage is completed before moving to the next stage
    if (stageIndex > 0 && !tasks.find((task) => task.taskStage === previousStage)) {
      alert(`Please complete the ${previousStage} stage first.`);
      return;
    }
  
    // Ensure oProjectId is converted to an integer before sending
    const projectId = parseInt(selectedProject.oprojectId, 10); // Convert to integer
  
    if (isNaN(projectId)) {
      console.error('Invalid project ID:', selectedProject.oprojectId);
      return;
    }
  
    // Validate form fields before allowing completion
    if (stage === 'Complete' && (!realBudget || !vendorInvoice || !supplierInvoice || !appendices)) {
      alert('Please fill out all necessary fields and upload all required files before marking as complete.');
      return;
    }
  
    const requestData = {
      projectId, // Send the projectId as an integer
      taskStage: stage,
      date: new Date().toISOString(),
    };
  
    try {
      const response = await fetch(updateTaskUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });
  
      if (response.ok) {
        if (stage === 'Complete') {
          setUploadVisible(true);
        }
        // Refresh tasks after a successful update
        fetchTasksForProject(selectedProject.oprojectId);
      } else {
        console.error('Failed to update task status');
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };
  
  // Handle file uploads
  const handleFileChange = (setter) => (event) => {
    setter(event.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('oprojectId', selectedProject.oprojectId);
    formData.append('realBudget', realBudget);
    formData.append('vendorInvoice', vendorInvoice);
    formData.append('supplierInvoice', supplierInvoice);
    formData.append('appendices', appendices);

    try {
      const response = await fetch(uploadUrl, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        setUploadVisible(false);
        fetchTasksForProject(selectedProject.oprojectId);
      } else {
        console.error('Failed to upload data');
      }
    } catch (error) {
      console.error('Error uploading data:', error);
    }
  };

  const ProgressCircle = ({ label, progress, allProjects }) => {
    const percentage = allProjects > 0 ? (progress / allProjects) * 100 : 0;

    return (
      <div className="progress-circle-container">
        <div className="progress-circle">
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke="#ddd"
              strokeWidth="10"
              fill="none"
            />
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke="#007BFF"
              strokeWidth="10"
              fill="none"
              strokeDasharray={`${(percentage * Math.PI * 2 * 50) / 100} ${
                Math.PI * 2 * 50
              }`}
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

  const isPastDue = (expectedDate) => {
    const currentDate = new Date();
    const dueDate = new Date(expectedDate);
    return currentDate > dueDate;
  };

  return (
    <div className="project-dashboard-container">
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

      <h2 className="project-title">Project Dashboard</h2>

      <button
        onClick={() => setModalVisible(true)}
        className="open-form-btn"
      >
        Create Project
      </button>

      <div className="tables-layout">
        <div className="project-table-container">
          <table className="project-table">
            
              <tr>
                <th>Project Name</th>
                <th>Supervisor</th>
                <th>Expected Date</th>
                <th>Expected Budget</th>
              </tr>
              <tbody>
  {projects.map((project) => (
    <tr
      key={project.oprojectId}
      onClick={() => handleRowClick(project)}
      className={`${project.status === 'Complete' ? 'completed-row' : ''} ${isPastDue(project.expectedTime) && project.status !== 'Complete' ? 'past-due-row' : ''}`}
    >
      <td>
        {project.projectName}
        {project.status === 'Complete' && (
          <span style={{ marginLeft: '10px', color: 'green' }}>✔️</span>
        )}
      </td>
      <td>{project.supervisor}</td>
      <td
        style={{
          color:
            isPastDue(project.expectedTime) &&
            project.status !== 'Complete'
              ? 'red'
              : 'inherit',
        }}
      >
        {new Date(project.expectedTime).toISOString().split('T')[0]}
      </td>
      <td>{project.expectedBudget}</td>
    </tr>
  ))}
</tbody>
          </table>
        </div>

        {selectedProject && (
          <div className="task-table-container">
            <h3>Task Overview</h3>
            <table className="task-table">
              <thead>
                <tr>
                  <th>Stage</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stages.map((stage) => {
                  const taskForStage = tasks.find((task) => task.taskStage === stage);
                  const isChecked = !!taskForStage; // If task exists, checkbox will be checked

                  return (
                    <tr key={stage}>
                      <td>{stage}</td>
                      <td>
                        <input
                          type="checkbox"
                          checked={isChecked} // Checkbox is checked if task exists
                          onChange={(e) =>
                            handleTaskStatusChange(
                              taskForStage?.taskId,
                              stage,
                              e.target.checked
                            )
                          }
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {uploadVisible && (
        <div className="upload-form">
          <h3>Complete the Project</h3>
          <form>
            <label>
              Real Budget:
              <input
                type="text"
                value={realBudget}
                onChange={(e) => setRealBudget(e.target.value)}
              />
            </label>
            <label>
              Vendor Invoice:
              <input
                type="file"
                onChange={handleFileChange(setVendorInvoice)}
              />
            </label>
            <label>
              Supplier Invoice:
              <input
                type="file"
                onChange={handleFileChange(setSupplierInvoice)}
              />
            </label>
            <label>
              Appendices:
              <input
                type="file"
                onChange={handleFileChange(setAppendices)}
              />
            </label>
          </form>
          <button onClick={handleUpload}>Submit</button>
        </div>
      )}

      {modalVisible && (
        <ProjectFormPopup
          onClose={() => setModalVisible(false)}
          refreshProjects={() => fetchProjects()}
        />
      )}
    </div>
  );
}

export default ProjectDashboard;
