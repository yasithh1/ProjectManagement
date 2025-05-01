import React, { useState, useEffect } from 'react';
import '../style/DesignDashboard.css';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import DesignFormPopup from '../components/DesignFormPopup';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function DesignDashboard() {
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [designs, setDesigns] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [uploadVisible, setUploadVisible] = useState(false);
  const [file, setFile] = useState(null);
  const [progressData, setProgressData] = useState({
    Analyse: 0,
    Design: 0,
    Hold: 0,
    Complete: 0,
    Approval: 0,
    allDesigns: 0,
  });

  const empId = localStorage.getItem('empId');
  const updateTaskUrl = 'http://localhost:8081/api7/ongoing/task';
  const uploadUrl = 'http://localhost:8081/api7/ongoing/upload';
  const stages = ['Analyse', 'Design', 'Complete', 'Approval', 'Hold'];

  useEffect(() => {
    const fetchDesigns = async () => {
      if (!empId) return;

      try {
        const response = await fetch(`http://localhost:8081/api7/ongoing/version/${empId}`);
        if (response.ok) {
          const data = await response.json();
          setDesigns(Array.isArray(data) ? data : []);
        } else {
          console.error('Failed to fetch designs');
        }
      } catch (error) {
        console.error('Error fetching designs:', error);
      }
    };

    fetchDesigns();
  }, [empId]);

  useEffect(() => {
    const fetchProgressData = async () => {
      if (!empId) return;

      try {
        const response = await fetch(`http://localhost:8081/api7/ongoing/status/${empId}`);
        if (response.ok) {
          const data = await response.json();
          setProgressData({
            Analyse: data.Analyse || 0,
            Design: data.Design || 0,
            Hold: data.hold || 0,
            Complete: data.Complete || 0,
            Approval: data.Approval || 0,
            allDesigns: data.allDesigns || 0,
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

  const fetchTasksForDesign = async (designId) => {
    try {
      const response = await fetch(`http://localhost:8081/api7/ongoing/task/${designId}`);
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

  const handleRowClick = (design) => {
    setSelectedDesign(design);
    fetchTasksForDesign(design.odesignId);
  };

  const handleTaskStatusChange = async (taskId, stage, isChecked) => {
    if (!isChecked) return;

    // Validate task order
    const stageIndex = stages.indexOf(stage);
    const previousStage = stages[stageIndex - 1];
    if (stageIndex > 0 && !tasks.find(task => task.status === previousStage)) {
      alert(`Please complete the ${previousStage} stage first.`);
      return;
    }

    const date = new Date().toISOString().split('T')[0];
    const requestData = {
      odesignId: selectedDesign.odesignId,
      status: stage,
      date: date,
    };

    try {
      const response = await fetch(updateTaskUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        if (stage === 'Approval') {
          setUploadVisible(true);
        }
        fetchTasksForDesign(selectedDesign.odesignId);
      } else {
        console.error('Failed to update task status');
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('oDesignId', selectedDesign.odesignId);
    formData.append('status', 'for approval');

    try {
      const response = await fetch(uploadUrl, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        setUploadVisible(false);
        fetchTasksForDesign(selectedDesign.odesignId);
      } else {
        console.error('Failed to upload file');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const ProgressCircle = ({ label, progress, allDesigns }) => {
    const percentage = allDesigns > 0 ? (progress / allDesigns) * 100 : 0;

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

  const isPastDue = (expectedDate) => {
    const currentDate = new Date();
    const dueDate = new Date(expectedDate);
    return currentDate > dueDate;
  };

  return (
    <div className="design-report-container">
      <div className="progress-circles">
        {stages.map((stage) => (
          <ProgressCircle
            key={stage}
            label={stage}
            progress={progressData[stage] || 0}
            allDesigns={progressData.allDesigns || 0}
          />
        ))}
      </div>

      <h2 className="design-title">Design Report</h2>

      <button onClick={() => setModalVisible(true)} className="open-form-btn">
        Create Design
      </button>

      <div className="tables-layout">
        <div className="design-table-container">
          <table className="design-table">
            <thead>
              <tr>
                <th>Design Name</th>
                <th>Design Type</th>
                <th>Expected Date</th>
              </tr>
            </thead>
            <tbody>
              {designs.map((design) => (
                <tr key={design.odesignId} onClick={() => handleRowClick(design)}>
                  <td>{design.designName}</td>
                  <td>{design.designType}</td>
                  <td
                    style={{ color: isPastDue(design.expectedTime) && design.status !== 'Approval' ? 'red' : 'inherit' }}
                  >
                    {new Date(design.expectedTime).toISOString().split('T')[0]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedDesign && (
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
                  const taskForStage = tasks.find((task) => task.status === stage);
                  const isChecked = !!taskForStage;

                  return (
                    <tr key={stage}>
                      <td>{stage}</td>
                      <td>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => handleTaskStatusChange(taskForStage?.dtaskId, stage, e.target.checked)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {uploadVisible && (
              <div className="upload-form">
                <h3>Upload Design</h3>
                <input type="file" onChange={handleFileChange} />
                <button onClick={handleUpload}>Upload</button>
              </div>
                       )}
                       </div>
                     )}
             
                     {modalVisible && (
                       <div className="popup-overlay">
                         <DesignFormPopup closePopup={() => setModalVisible(false)} />
                       </div>
                     )}
                   </div>
                 </div>
               );
             }
             
             export default DesignDashboard;
             
