import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../style/Assigments.css';

function ProjectAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [employeeDetails, setEmployeeDetails] = useState({});
  const [supporterTasks, setSupporterTasks] = useState([]);
  const [taskStatus, setTaskStatus] = useState({});
  const [taskComment, setTaskComment] = useState({});
  const empId = localStorage.getItem('empId'); // Assuming empId is stored in local storage

  // Fetch assignments by employee ID
  const fetchAssignments = async (assignTo) => {
    try {
      const response = await axios.get(`http://localhost:8081/api6/assignments/project/${assignTo}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = Array.isArray(response.data) ? response.data : [response.data];
      setAssignments(data);
    } catch (error) {
      console.error("Error fetching assignments", error);
    }
  };

  // Fetch employee details by employee ID
  const fetchEmployeeDetails = async (empId) => {
    try {
      const response = await axios.get(`http://localhost:8081/api/employee/${empId}`);
      setEmployeeDetails(prevState => ({ ...prevState, [empId]: response.data }));
    } catch (error) {
      console.error("Error fetching employee details", error);
    }
  };

  // Fetch tasks by supporter ID
  const fetchSupporterTasks = async (supporterId) => {
    try {
      const response = await axios.get(`http://localhost:8081/api/supporters/supporter/${supporterId}`);
      setSupporterTasks(response.data);
    } catch (error) {
      console.error("Error fetching supporter tasks", error);
    }
  };

  const updateTask = async (taskId, status, comment) => {
    try {
      await axios.put(`http://localhost:8081/api/supporters/update/${taskId}`, null, {
        params: {
          status: status,
          comment: comment,
        },
      });
      alert('Task updated successfully');
      fetchSupporterTasks(empId);
    } catch (error) {
      console.error("Error updating task", error);
      alert('Failed to update task');
    }
  };

  useEffect(() => {
    if (empId) {
      fetchAssignments(empId);
      fetchSupporterTasks(empId);
    }
  }, [empId]);

  useEffect(() => {
    if (assignments.length > 0) {
      assignments.forEach(assignment => {
        fetchEmployeeDetails(assignment.projectAssignBy);
      });
    }
  }, [assignments]);

  return (
    <div className="assignments-container">
      <h2 className="assignments-title">Project Assignments</h2>
      <div className="assignments-list">
        {assignments.length > 0 ? (
          assignments.map(assignment => (
            <div key={assignment.assignProjectId} className="assignment-item">
              <h3 className="assignment-title">Project ID: {assignment.assignProjectId}</h3>
              <p className="assignment-detail">Assigned To: {assignment.projectAssignTo}</p>
              <p className="assignment-detail">Assigned By: {employeeDetails[assignment.projectAssignBy]?.firstName} {employeeDetails[assignment.projectAssignBy]?.lastName}</p>
              <p className="assignment-detail">Design ID: {assignment.designId}</p>
              <p className="assignment-detail">Created At: {assignment.createdAt ? new Date(assignment.createdAt).toLocaleDateString() : 'N/A'}</p>
            </div>
          ))
        ) : (
          <p>No assignments found.</p>
        )}
      </div>

      <h2 className="assignments-title">Supporter Tasks</h2>
      <div className="tasks-list">
        {supporterTasks.length > 0 ? (
          supporterTasks.map(task => (
            <div key={task.taskId} className="task-item">
              <h3 className="task-title">Task ID: {task.taskId}</h3>
              <p className="task-detail">Task: {task.task}</p>
              <p className="task-detail">Status: 
                <select 
                  value={taskStatus[task.taskId] || task.status}
                  onChange={(e) => setTaskStatus({ ...taskStatus, [task.taskId]: e.target.value })}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </p>
              <p className="task-detail">Comment: 
                <input 
                  type="text" 
                  value={taskComment[task.taskId] || task.comment}
                  onChange={(e) => setTaskComment({ ...taskComment, [task.taskId]: e.target.value })}
                />
              </p>
              <button onClick={() => updateTask(task.taskId, taskStatus[task.taskId] || task.status, taskComment[task.taskId] || task.comment)}>Update Task</button>
            </div>
          ))
        ) : (
          <p>No tasks found.</p>
        )}
      </div>
    </div>
  );
}

export default ProjectAssignments;
