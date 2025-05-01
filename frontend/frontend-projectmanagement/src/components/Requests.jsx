import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import "../style/Requests.css";

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      const supplierEmail = localStorage.getItem('supplierEmail');
      console.log('Supplier Email from LocalStorage:', supplierEmail);

      if (!supplierEmail) {
        setError('Supplier Email is missing. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8081/api/supplier/${supplierEmail}`);
        console.log('API Response:', response.data); // Log the entire response data
        if (Array.isArray(response.data)) {
          setRequests(response.data);
        } else {
          setError('Invalid data format received.');
        }
      } catch (error) {
        console.error('Error fetching requests:', error);
        setError('Error fetching requests.');
      }
      setLoading(false);
    };

    fetchRequests();
  }, []);

  const handleAccept = () => {
    console.log('Navigating to invoice page');
    navigate('/dashboard/invoice');
  };

  const handleReject = async (requestId) => {
    try {
      await axios.post(`http://localhost:8081/api10/${requestId}/status`);
      setRequests(prevRequests =>
        prevRequests.map(request =>
          request.id === requestId ? { ...request, status: 'Rejected' } : request
        )
      );
      alert('Request has been rejected.');
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('There was an error rejecting the request.');
    }
  };

  return (
    <div className="requests-container">
      <h2>Requests Sent to You</h2>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {Array.isArray(requests) && requests.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Engineer Email</th>
              <th>Phone Number</th>
              <th>Status</th> {/* New Column for Status */}
              <th>Actions</th> {/* New Column for Actions */}
            </tr>
          </thead>
          <tbody>
            {requests.map((request, index) => (
              <tr key={index}>
                <td>{request.productName}</td>
                <td>{request.quantity}</td>
                <td>{request.email}</td> {/* Engineer's email */}
                <td>{request.phoneNumber}</td> {/* Engineer's phone number */}
                <td>{request.status || 'Pending'}</td> {/* Show status */}
                <td>
                  <button onClick={handleAccept}>Accept</button>
                  <button onClick={() => handleReject(request.id)}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No requests found.</p>
      )}
    </div>
  );
};

export default Requests;
