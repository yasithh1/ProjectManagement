import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../style/AssignSupporterTask.css';

function AssignSupporterTask() {
  const [supporters, setSupporters] = useState([]);
  const [selectedSupporter, setSelectedSupporter] = useState(null);
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [supporterDetails, setSupporterDetails] = useState({});
  const empId = localStorage.getItem('empId');

  useEffect(() => {
    fetchAcceptedSupporters();
  }, []);

  const fetchAcceptedSupporters = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/api/supporters/${empId}`);
      const acceptedSupporters = response.data.filter(supporter => supporter.status === 'Accepted');
      setSupporters(acceptedSupporters);
      await fetchSupporterDetails(acceptedSupporters);
      await fetchAllTasks(acceptedSupporters);
    } catch (error) {
      console.error('Error fetching supporters:', error);
    }
  };

  const fetchSupporterDetails = async (supporters) => {
    const details = {};
    for (const supporter of supporters) {
      try {
        const response = await axios.get(`http://localhost:8081/api/employee/${supporter.requestTo}`);
        if (response.status === 200) {
          const data = response.data;
          details[supporter.requestTo] = data;
        } else {
          console.error(`Failed to fetch details for supporter ID ${supporter.requestTo}`);
        }
      } catch (error) {
        console.error(`Error fetching details for supporter ID ${supporter.requestTo}:`, error);
      }
    }
    setSupporterDetails(details);
  };

  const fetchAllTasks = async (supporters) => {
    const allTasks = [];
    for (const supporter of supporters) {
      try {
        const response = await axios.get(`http://localhost:8081/api/supporters/supporter/${supporter.requestTo}`);
        if (response.status === 200) {
          allTasks.push(...response.data);
        } else {
          console.error(`Failed to fetch tasks for supporter ID ${supporter.requestTo}`);
        }
      } catch (error) {
        console.error(`Error fetching tasks for supporter ID ${supporter.requestTo}:`, error);
      }
    }
    setTasks(allTasks);
  };

  const handleSupporterSelect = (e) => {
    const supporterId = e.target.value;
    const supporter = supporters.find(s => s.requestTo === supporterId);
    setSelectedSupporter(supporter);
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    if (selectedSupporter && task) {
      try {
        await axios.post('http://localhost:8081/api/supporters/create-supporter-task', {
          supporterId: selectedSupporter.requestTo,
          task,
          status: 'Pending'
        });
        alert('Task assigned successfully');
        setTask('');
        fetchAllTasks(supporters);
      } catch (error) {
        console.error('Error assigning task:', error);
        alert('Failed to assign task');
      }
    } else {
      alert('Please select a supporter and enter a task');
    }
  };

  const filteredTasks = selectedSupporter ? tasks.filter(task => task.supporterId === selectedSupporter.requestTo) : tasks;

  return (
    <div className="assign-supporter-task-container">
      <h2>Assign Task to Supporter</h2>
      <div className="form-group">
        <label htmlFor="supporter-select">Select Supporter:</label>
        <select id="supporter-select" onChange={handleSupporterSelect} value={selectedSupporter ? selectedSupporter.requestTo : ''}>
          <option value="" disabled>Select a Supporter</option>
          {supporters.map(supporter => (
            <option key={supporter.supporterId} value={supporter.requestTo}>
              {supporterDetails[supporter.requestTo]?.fullName} (ID: {supporter.requestTo})
            </option>
          ))}
        </select>
      </div>
      {selectedSupporter && (
        <div className="selected-supporter">
          <h3>Selected Supporter: {supporterDetails[selectedSupporter.requestTo]?.fullName} (ID: {selectedSupporter.requestTo})</h3>
          <form onSubmit={handleTaskSubmit}>
            <label>
              Task:
              <input 
                type="text" 
                value={task} 
                onChange={(e) => setTask(e.target.value)} 
                required 
              />
            </label>
            <button type="submit">Assign Task</button>
          </form>
        </div>
      )}
      <h3>Task Progress</h3>
      <div className="task-progress-list">
        {filteredTasks.map(task => (
          <div key={task.taskId} className={`task-item ${task.status === 'Completed' ? 'status-completed' : 'status-pending'}`}>
            <img src={`data:image/png;base64,${supporterDetails[task.supporterId]?.profilePic}`} alt="Profile" />
            <div className="task-details">
              <p><strong>Name:</strong> {supporterDetails[task.supporterId]?.firstName}</p>
              <p><strong>Task:</strong> {task.task}</p>
              <p><strong>Status:</strong> {task.status}</p>
              <p><strong>Comment:</strong> {task.comment}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AssignSupporterTask;
