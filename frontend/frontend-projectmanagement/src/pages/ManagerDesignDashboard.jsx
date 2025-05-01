import React, { useState, useEffect } from 'react';
import '../style/DesignDashboard.css';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function ManagerDesignDashboard() {
  const [employeeId, setEmployeeId] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [designs, setDesigns] = useState([]);
  const [progressData, setProgressData] = useState({
    Analyse: 0,
    Design: 0,
    Hold: 0,
    Complete: 0,
    Approval: 0,
    allDesigns: 0,
  });

  const stages = ['Analyse', 'Design', 'Complete', 'Approval', 'Hold'];

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        const response = await fetch('http://localhost:8081/api/manager/designs/status-count');
        if (response.ok) {
          const data = await response.json();
          setProgressData({
            Analyse: data.Analyse || 0,
            Design: data.Design || 0,
            Hold: data.Hold || 0,
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

  const fetchDesigns = async (designerId) => {
    try {
      const response = await fetch(`http://localhost:8081/api7/ongoing/version/${designerId}`);
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

  const handleEmployeeIdChange = async (event) => {
    const empId = event.target.value;
    setEmployeeId(empId);
    await fetchEmployeeName(empId);
    await fetchDesigns(empId);
  };

  const handleRowClick = (design) => {
    setSelectedDesign(design);
    fetchTasksForDesign(design.odesignId);
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

      <h2 className="design-title">Design Report</h2>

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
                          readOnly
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
    </div>
  );
}

export default ManagerDesignDashboard;
