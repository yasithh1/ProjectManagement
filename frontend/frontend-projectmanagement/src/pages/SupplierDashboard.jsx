import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import axios from 'axios';
import Tile from '../components/Tile';
import Navbar from '../components/Navbar';
import '../style/SupplierDashboard.css';

const SupplierDashboard = ({ setRole }) => {
  const [requests, setRequests] = useState([]);
  const [employeeDetails, setEmployeeDetails] = useState({});

  const tiles = [
    { name: 'Contracts', icon: 'assignment', color: '#6CD071', path: '/dashboard/contract-details' },
    { name: 'Profile', icon: 'person', color: '#FFA726', path: '/Sprofile' },
    { name: 'Upload Items', icon: 'cloud_upload', color: '#42A5F5', path: '/dashboard/upload-item' },
    { name: 'View Reviews', icon: 'rate_review', color: '#FFCA28', path: '/dashboard/view-reviews' },
    { name: 'Requests', icon: 'question_answer', color: '#E57373', path: '/dashboard/requests' },
    { name: 'Invoice', icon: 'receipt', color: '#9C27B0', path: '/dashboard/invoice' },
  ];

  useEffect(() => {
    const supplierEmail = localStorage.getItem('supplierEmail');
    if (supplierEmail) {
      axios.get(`http://localhost:8081/api10/supplier/${supplierEmail}`)
        .then(response => {
          setRequests(response.data);
        })
        .catch(error => {
          console.error('There was an error fetching the requests!', error);
        });
    }
  }, []);

  const handleShowDetails = (empId) => {
    axios.get(`http://localhost:8081/api/employee/${empId}`)
      .then(response => {
        setEmployeeDetails(prevState => ({
          ...prevState,
          [empId]: response.data
        }));
      })
      .catch(error => {
        console.error('There was an error fetching the employee details!', error);
      });
  };

  const handleStatusChange = (id, status) => {
    axios.put(`http://localhost:8081/api10/${id}/${status}`, status)
      .then(response => {
        setRequests(requests.map(request => request.id === id ? { ...request, status } : request));
      })
      .catch(error => {
        console.error('There was an error updating the request status!', error);
      });
  };

  const handleSignOut = () => {
    localStorage.clear();
    sessionStorage.removeItem("sessionActive");
    setRole(null);
  };

  return (
    <>
      <Navbar setRole={setRole} handleSignOut={handleSignOut} />
      <div className="dashboard-container">
        <div className="Sdashboard-header">
          <h2>Dashboard</h2>
        </div>
        <div className="tiles-container">
          {tiles.map((tile, index) => (
            <Tile
              key={index}
              tile={tile}
              onClick={() => window.location.href = tile.path}
            />
          ))}
        </div>
        <div className="requests-container">
          <h3>Supplier Requests</h3>
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Employee Details</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request, index) => (
                <tr key={index}>
                  <td>{request.productName}</td>
                  <td>{request.quantity}</td>
                  <td>
                    <button onClick={() => handleShowDetails(request.empId)}>
                      View Details
                    </button>
                    {employeeDetails[request.empId] && (
                      <div className="employee-details">
                        <p>Name: {employeeDetails[request.empId].firstName} {employeeDetails[request.empId].lastName}</p>
                        <p>Email: {employeeDetails[request.empId].email}</p>
                        <p>Phone: {employeeDetails[request.empId].phoneNumber}</p>
                      </div>
                    )}
                  </td>
                  <td>{request.status}</td>
                  <td>
                    <button onClick={() => handleStatusChange(request.id, 'Accepted')}>
                      Accept
                    </button>
                    <button onClick={() => handleStatusChange(request.id, 'Rejected')}>
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Outlet />
      </div>
    </>
  );
};

export default SupplierDashboard;
