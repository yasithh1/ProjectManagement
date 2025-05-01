import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ContactFormModal.css';

const ContactFormModal = ({ isOpen, onClose, supplierEmail, supplierProductName }) => {
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    if (isOpen) {
      setEmail(supplierEmail);
      setProductName(supplierProductName);
    }
  }, [isOpen, supplierEmail, supplierProductName]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const empId = localStorage.getItem('empId'); // Get empId from local storage

    const requestData = {
      productName,
      quantity,
      empId,        // Add empId to request data
      number,
      supplierEmail
    };

    // Send the data to the backend
    axios.post('http://localhost:8081/api10/request', requestData)
      .then(response => {
        console.log('Request sent successfully:', response.data);
        onClose(); // Close the modal after submission
      })
      .catch(error => {
        console.error('There was an error sending the request!', error);
      });
  };

  return (
    isOpen && (
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="close-button" onClick={onClose}>&times;</button>
          <h2>Contact Supplier</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="productName">Product Name</label>
              <input
                type="text"
                id="productName"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="quantity">Quantity</label>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Supplier Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                readOnly // Make it read-only
              />
            </div>
            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="text"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
            <button type="submit">Send Request</button>
          </form>
        </div>
      </div>
    )
  );
};

export default ContactFormModal;
